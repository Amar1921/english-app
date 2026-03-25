import prisma from '../prisma.js';

export const getProgress = async (req, res) => {
  const userId = req.user.id;
  try {
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
      id: a.id,
      isCorrect: a.isCorrect,
      score: a.score,
      category: a.question.category,
      level: a.question.level,
      createdAt: a.createdAt,
    }));

    return res.json({
      stats: { total, correct, accuracy: total ? Math.round((correct / total) * 100) : 0, totalScore },
      byCategory,
      byLevel,
      recentActivity,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch progress' });
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
