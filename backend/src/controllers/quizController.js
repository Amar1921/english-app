import prisma from '../prisma.js';

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

// Seuils pour passer au niveau suivant
const LEVEL_UP_MIN_QUESTIONS = 10;   // minimum de questions répondues sur le niveau
const LEVEL_UP_ACCURACY      = 0.70; // 70% de bonnes réponses sur ce niveau

// Normalise le champ choices (Json Prisma) en tableau JS
const parseChoices = (choices) => {
  if (!choices) return [];
  if (Array.isArray(choices)) return choices;
  try { return JSON.parse(choices); } catch { return []; }
};

/**
 * Vérifie si le user mérite de passer au niveau suivant.
 * Retourne le nouveau niveau si montée, null sinon.
 */
const checkLevelUp = async (userId, currentLevel) => {
  const currentIdx = LEVEL_ORDER.indexOf(currentLevel);
  const isMaxLevel = currentIdx === LEVEL_ORDER.length - 1;
  if (isMaxLevel) return null;

  // Toutes les tentatives du user sur le niveau actuel
  const attempts = await prisma.attempt.findMany({
    where: {
      userId,
      question: { level: currentLevel },
    },
    select: { isCorrect: true },
  });

  const total   = attempts.length;
  const correct = attempts.filter((a) => a.isCorrect).length;

  if (total < LEVEL_UP_MIN_QUESTIONS) return null;
  if (correct / total < LEVEL_UP_ACCURACY) return null;

  return LEVEL_ORDER[currentIdx + 1];
};

// ─────────────────────────────────────────────────────────────────────────────

export const getQuestions = async (req, res) => {
  const { level, category, limit = 10 } = req.query;

  try {
    const where = {};
    if (level)    where.level    = level;
    if (category) where.category = category.toUpperCase();

    const total = await prisma.question.count({ where });
    const skip  = Math.floor(Math.random() * Math.max(0, total - parseInt(limit)));

    const raw = await prisma.question.findMany({
      where,
      take: parseInt(limit),
      skip,
      select: {
        id: true, type: true, level: true, category: true,
        question: true, choices: true, points: true,
      },
    });

    const questions = raw.map((q) => ({ ...q, choices: parseChoices(q.choices) }));

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
    const score     = isCorrect ? question.points : 0;

    // 1. Enregistrer la tentative
    await prisma.attempt.create({
      data: { userId, questionId, userAnswer, isCorrect, score },
    });

    // 2. Récupérer le user actuel
    let user = await prisma.user.findUnique({
      where:  { id: userId },
      select: { level: true, xp: true },
    });

    // 3. Incrémenter XP si correct
    if (isCorrect) {
      user = await prisma.user.update({
        where:  { id: userId },
        data:   { xp: { increment: score } },
        select: { level: true, xp: true },
      });
    }

    // 4. Vérifier passage de niveau (uniquement si la question est du niveau actuel du user)
    let levelUp  = null;
    let newLevel = null;

    if (question.level === user.level) {
      newLevel = await checkLevelUp(userId, user.level);

      if (newLevel) {
        await prisma.user.update({
          where: { id: userId },
          data:  { level: newLevel },
        });
        levelUp = { from: user.level, to: newLevel };
      }
    }

    return res.json({
      isCorrect,
      score,
      correctAnswer: question.correctAnswer,
      explanation:   question.explanation,
      levelUp, // null si pas de changement, { from, to } si montée de niveau
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to submit answer' });
  }
};

export const getCategories = async (req, res) => {
  return res.json({
    levels:     ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    categories: ['GRAMMAR', 'VOCABULARY', 'READING', 'LISTENING'],
  });
};