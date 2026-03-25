import prisma from '../prisma.js';

export const getQuestions = async (req, res) => {
  const { level, category, limit = 10 } = req.query;

  try {
    const where = {};
    if (level) where.level = level;
    if (category) where.category = category.toUpperCase();

    const total = await prisma.question.count({ where });
    const skip = Math.floor(Math.random() * Math.max(0, total - parseInt(limit)));

    const questions = await prisma.question.findMany({
      where,
      take: parseInt(limit),
      skip,
      select: {
        id: true, type: true, level: true, category: true,
        question: true, choices: true, points: true,
      },
    });

    return res.json({ questions });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch questions' });
  }
};

export const submitAnswer = async (req, res) => {
  const { questionId, userAnswer } = req.body;
  const userId = req.user.id;

  if (!questionId || userAnswer === undefined)
    return res.status(400).json({ error: 'questionId and userAnswer are required' });

  try {
    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) return res.status(404).json({ error: 'Question not found' });

    const normalize = (s) => String(s).trim().toLowerCase();
    const isCorrect = normalize(userAnswer) === normalize(question.correctAnswer);
    const score = isCorrect ? question.points : 0;

    await prisma.attempt.create({
      data: { userId, questionId, userAnswer, isCorrect, score },
    });

    if (isCorrect) {
      await prisma.user.update({
        where: { id: userId },
        data: { xp: { increment: score } },
      });
    }

    return res.json({
      isCorrect,
      score,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to submit answer' });
  }
};

export const getCategories = async (req, res) => {
  return res.json({
    levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    categories: ['GRAMMAR', 'VOCABULARY', 'READING', 'LISTENING'],
  });
};
