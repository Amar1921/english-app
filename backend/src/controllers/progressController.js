import prisma from '../prisma.js';

export const getProgress = async (req, res) => {
  const userId = req.user.id;
  try {
    // Quiz attempts (existant)
    const attempts = await prisma.attempt.findMany({
      where: { userId },
      include: { question: { select: { level: true, category: true, type: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const total = attempts.length;
    const correct = attempts.filter((a) => a.isCorrect).length;
    const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);

    const byCategory = {};
    const byLevel = {};

    for (const a of attempts) {
      const cat = a.question.category;
      const lvl = a.question.level;

      if (!byCategory[cat]) byCategory[cat] = { total: 0, correct: 0 };
      byCategory[cat].total++;
      if (a.isCorrect) byCategory[cat].correct++;

      if (!byLevel[lvl]) byLevel[lvl] = { total: 0, correct: 0 };
      byLevel[lvl].total++;
      if (a.isCorrect) byLevel[lvl].correct++;
    }

    const recentActivity = attempts.slice(0, 20).map((a) => ({
      id:        a.id,
      isCorrect: a.isCorrect,
      score:     a.score,
      category:  a.question.category,
      level:     a.question.level,
      createdAt: a.createdAt,
    }));

    // Lessons progress (nouveau)
    const lessonProgress = await prisma.userProgress.findMany({
      where: { userId },
      select: { lessonId: true, status: true, xpEarned: true, completedAt: true },
    });

    const lessonsCompleted = lessonProgress.filter((p) => p.status === 'COMPLETED').length;
    const lessonsInProgress = lessonProgress.filter((p) => p.status === 'IN_PROGRESS').length;
    const lessonsXp = lessonProgress.reduce((sum, p) => sum + p.xpEarned, 0);

    return res.json({
      stats: {
        total,
        correct,
        accuracy:   total ? Math.round((correct / total) * 100) : 0,
        totalScore,
      },
      byCategory,
      byLevel,
      recentActivity,
      lessons: {
        completed:  lessonsCompleted,
        inProgress: lessonsInProgress,
        totalXp:    lessonsXp,
        items:      lessonProgress,
      },
    });
  } catch (err) {
    console.error(err);
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
        where: { id: userId },
        data:  { xp: { increment: xpEarned ?? 0 } },
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
    console.error(err);
    return res.status(500).json({ error: 'Failed to update progress' });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { xp: 'desc' },
      take: 10,
      select: { id: true, name: true, xp: true, level: true, streak: true },
    });
    return res.json({ leaderboard: users });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};