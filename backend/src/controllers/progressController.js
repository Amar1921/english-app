import prisma from '../prisma.js';

export const getProgress = async (req, res) => {
  const userId = req.user.id;

  try {
    // ── 1. Anciennes tentatives libres (table attempts) ────────────────────────
    const attempts = await prisma.attempt.findMany({
      where: { userId },
      include: { question: { select: { level: true, category: true } } },
      orderBy: { createdAt: 'desc' },
    });

    // ── 2. Tentatives via sessions (table quiz_attempts) ──────────────────────
    const quizAttempts = await prisma.quizAttempt.findMany({
      where:   { session: { userId, status: 'COMPLETED' } },
      include: { question: { select: { level: true, category: true } } },
      orderBy: { answeredAt: 'desc' },
    });

    // ── 3. Fusion des deux sources ────────────────────────────────────────────
    const allAttempts = [
      ...attempts.map((a) => ({
        id:        a.id,
        isCorrect: a.isCorrect,
        score:     a.score,
        level:     a.question.level,
        category:  a.question.category,
        createdAt: a.createdAt,
        source:    'free',
      })),
      ...quizAttempts.map((a) => ({
        id:        a.id,
        isCorrect: a.isCorrect,
        score:     a.score,
        level:     a.question.level,
        category:  a.question.category,
        createdAt: a.answeredAt,
        source:    'session',
      })),
    ];

    const total      = allAttempts.length;
    const correct    = allAttempts.filter((a) => a.isCorrect).length;
    const totalScore = allAttempts.reduce((sum, a) => sum + a.score, 0);

    // ── 4. Agrégation par niveau et catégorie ─────────────────────────────────
    const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

    // Initialise tous les niveaux à 0 pour garantir l'ordre et éviter les trous
    const byLevel = Object.fromEntries(
        LEVELS.map((l) => [l, { total: 0, correct: 0, incorrect: 0 }])
    );
    const byCategory = {};

    for (const a of allAttempts) {
      const lvl = a.level;
      const cat = a.category;

      if (byLevel[lvl]) {
        byLevel[lvl].total++;
        if (a.isCorrect) byLevel[lvl].correct++;
        else             byLevel[lvl].incorrect++;
      }

      if (!byCategory[cat]) byCategory[cat] = { total: 0, correct: 0 };
      byCategory[cat].total++;
      if (a.isCorrect) byCategory[cat].correct++;
    }

    // ── 5. Activité récente (20 dernières, toutes sources confondues) ─────────
    const recentActivity = allAttempts
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 20)
        .map((a) => ({
          id:        a.id,
          isCorrect: a.isCorrect,
          score:     a.score,
          category:  a.category,
          level:     a.level,
          source:    a.source,
          createdAt: a.createdAt,
        }));

    // ── 6. Lessons progress ───────────────────────────────────────────────────
    const lessonProgress = await prisma.userProgress.findMany({
      where:  { userId },
      select: { lessonId: true, status: true, xpEarned: true, completedAt: true },
    });

    const lessonsCompleted  = lessonProgress.filter((p) => p.status === 'COMPLETED').length;
    const lessonsInProgress = lessonProgress.filter((p) => p.status === 'IN_PROGRESS').length;
    const lessonsXp         = lessonProgress.reduce((sum, p) => sum + p.xpEarned, 0);

    return res.json({
      stats: {
        total,
        correct,
        incorrect: total - correct,
        accuracy:  total ? Math.round((correct / total) * 100) : 0,
        totalScore,
      },
      byLevel,     // { A1: { total, correct, incorrect }, ... } — tous les niveaux présents
      byCategory,
      recentActivity,
      lessons: {
        completed:  lessonsCompleted,
        inProgress: lessonsInProgress,
        totalXp:    lessonsXp,
        items:      lessonProgress,
      },
    });
  } catch (err) {
    console.error('[getProgress]', err);
    return res.status(500).json({ error: 'Failed to fetch progress' });
  }
};

export const updateProgress = async (req, res) => {
  const userId = req.user.id;
  const { lessonId } = req.params;
  const { status, xpEarned } = req.body;

  try {
    const existing = await prisma.userProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });

    const alreadyCompleted = existing?.status === 'COMPLETED';

    const progress = await prisma.userProgress.upsert({
      where:  { userId_lessonId: { userId, lessonId } },
      create: {
        userId,
        lessonId,
        status,
        xpEarned:    status === 'COMPLETED' ? (xpEarned ?? 0) : 0,
        completedAt: status === 'COMPLETED' ? new Date() : null,
      },
      update: {
        status,
        ...(status === 'COMPLETED' && !alreadyCompleted ? {
          xpEarned:    xpEarned ?? 0,
          completedAt: new Date(),
        } : {}),
      },
    });

    let updatedUser = null;
    if (status === 'COMPLETED' && !alreadyCompleted) {
      updatedUser = await prisma.user.update({
        where:  { id: userId },
        data:   { xp: { increment: xpEarned ?? 0 } },
        select: { xp: true, level: true },
      });
    }

    return res.json({
      lessonId:    progress.lessonId,
      status:      progress.status,
      xpEarned:    progress.xpEarned,
      completedAt: progress.completedAt,
      ...(updatedUser ? { userXp: updatedUser.xp, userLevel: updatedUser.level } : {}),
    });
  } catch (err) {
    console.error('[updateProgress]', err);
    return res.status(500).json({ error: 'Failed to update progress' });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { xp: 'desc' },
      take:    10,
      select:  { id: true, name: true, xp: true, level: true, streak: true },
    });
    return res.json({ leaderboard: users });
  } catch (err) {
    console.error('[getLeaderboard]', err);
    return res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};