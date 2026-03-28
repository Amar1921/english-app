import prisma from '../prisma.js';
import bcrypt from 'bcryptjs';

// ─── PATCH /api/user/profile ──────────────────────────────────────────────────

export const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, email } = req.body;

  if (!name?.trim() && !email?.trim())
    return res.status(400).json({ error: 'At least one field (name or email) is required' });

  try {
    if (email) {
      const existing = await prisma.user.findFirst({
        where: { email, NOT: { id: userId } },
      });
      if (existing) return res.status(409).json({ error: 'Email already in use' });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name?.trim()  ? { name:  name.trim()  } : {}),
        ...(email?.trim() ? { email: email.trim() } : {}),
      },
      select: { id: true, name: true, email: true, level: true, xp: true, streak: true },
    });

    return res.json({ user: updated });
  } catch (err) {
    console.error('[updateProfile]', err);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
};

// ─── PATCH /api/user/password ──────────────────────────────────────────────────

export const updatePassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword)
    return res.status(400).json({ error: 'currentPassword and newPassword are required' });
  if (newPassword.length < 8)
    return res.status(400).json({ error: 'New password must be at least 8 characters' });

  try {
    const user  = await prisma.user.findUnique({ where: { id: userId } });
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });

    return res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('[updatePassword]', err);
    return res.status(500).json({ error: 'Failed to update password' });
  }
};

// ─── DELETE /api/user/account ──────────────────────────────────────────────────

export const deleteAccount = async (req, res) => {
  const userId = req.user.id;
  const { password } = req.body;

  if (!password)
    return res.status(400).json({ error: 'Password is required to delete account' });

  try {
    const user  = await prisma.user.findUnique({ where: { id: userId } });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Incorrect password' });

    await prisma.user.delete({ where: { id: userId } });
    return res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('[deleteAccount]', err);
    return res.status(500).json({ error: 'Failed to delete account' });
  }
};

// ─── GET /api/user/profile ────────────────────────────────────────────────────
// Retourne le profil complet avec les vraies stats calculées depuis quiz_sessions.

export const getProfile = async (req, res) => {
  try {
    const userId = parseInt(req.user.id);

    // ── Données user ──────────────────────────────────────────────────────────
    const user = await prisma.user.findUnique({
      where:  { id: userId },
      select: {
        id: true, name: true, email: true, level: true,
        xp: true, streak: true, isVerified: true,
        createdAt: true, lastLogin: true,
      },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // ── Stats quiz (sessions complètes uniquement) ────────────────────────────
    const completedSessions = await prisma.quizSession.findMany({
      where:   { userId, status: 'COMPLETED' },
      include: { attempts: { select: { isCorrect: true, score: true, question: { select: { category: true } } } } },
    });

    let totalAnswered  = 0;
    let totalCorrect   = 0;
    let totalXpQuiz    = 0;
    const categoryMap  = {};

    for (const session of completedSessions) {
      if (session.xpAwarded) totalXpQuiz += session.score;
      for (const attempt of session.attempts) {
        totalAnswered++;
        if (attempt.isCorrect) totalCorrect++;
        const cat = attempt.question?.category ?? 'UNKNOWN';
        if (!categoryMap[cat]) categoryMap[cat] = { answered: 0, correct: 0 };
        categoryMap[cat].answered++;
        if (attempt.isCorrect) categoryMap[cat].correct++;
      }
    }

    // Catégorie favorite = celle avec le plus de bonnes réponses
    const favouriteCategory = Object.entries(categoryMap).sort(
      (a, b) => b[1].correct - a[1].correct
    )[0]?.[0] ?? null;

    const byCategory = Object.fromEntries(
      Object.entries(categoryMap).map(([cat, v]) => [
        cat,
        {
          answered: v.answered,
          correct:  v.correct,
          accuracy: v.answered > 0 ? Math.round((v.correct / v.answered) * 100) : 0,
        },
      ])
    );

    // ── Stats lessons ─────────────────────────────────────────────────────────
    const progressRows = await prisma.userProgress.findMany({
      where:  { userId },
      select: { lessonId: true, status: true, xpEarned: true, completedAt: true, updatedAt: true },
    });

    const lessonsCompleted  = progressRows.filter((p) => p.status === 'COMPLETED').length;
    const lessonsInProgress = progressRows.filter((p) => p.status === 'IN_PROGRESS').length;
    const totalXpLessons    = progressRows.reduce((sum, p) => sum + p.xpEarned, 0);

    const lessonProgress = progressRows.map((p) => ({
      lessonId:    p.lessonId,
      status:      p.status,
      xpEarned:    p.xpEarned,
      completedAt: p.completedAt?.toISOString() ?? null,
      updatedAt:   p.updatedAt.toISOString(),
    }));

    // ── Activité récente (10 dernières sessions) ───────────────────────────────
    const recentSessions = await prisma.quizSession.findMany({
      where:   { userId, status: 'COMPLETED' },
      orderBy: { completedAt: 'desc' },
      take:    10,
      select: {
        id: true, lessonSlug: true, score: true, maxScore: true,
        xpAwarded: true, completedAt: true,
      },
    });

    const recentActivity = recentSessions.map((s) => ({
      type:        'quiz',
      sessionId:   s.id,
      lessonSlug:  s.lessonSlug,
      score:       s.score,
      maxScore:    s.maxScore,
      passed:      s.xpAwarded,
      completedAt: s.completedAt?.toISOString() ?? null,
    }));

    return res.json({
      user: {
        ...user,
        createdAt: user.createdAt.toISOString(),
        lastLogin: user.lastLogin?.toISOString() ?? null,
      },
      stats: {
        totalXp: user.xp,
        quiz: {
          totalAnswered,
          totalCorrect,
          accuracy:     totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0,
          totalXpQuiz,
          sessionsCompleted: completedSessions.length,
        },
        lessons: {
          completed:       lessonsCompleted,
          inProgress:      lessonsInProgress,
          totalXpLessons,
        },
        byCategory,
        favouriteCategory,
      },
      lessonProgress,
      recentActivity,
    });
  } catch (err) {
    console.error('[getProfile]', err);
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
};
