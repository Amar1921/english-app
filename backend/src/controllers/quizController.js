import prisma from '../prisma.js';

const LEVEL_ORDER            = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const LEVEL_UP_MIN_QUESTIONS = 10;
const LEVEL_UP_ACCURACY      = 0.70;
const QUIZ_PASS_THRESHOLD    = 0.60; // 60% pour valider un quiz et obtenir l'XP

// ─── Helpers ─────────────────────────────────────────────────────────────────

const parseChoices = (choices) => {
  if (!choices) return [];
  if (Array.isArray(choices)) return choices;
  try { return JSON.parse(choices); } catch { return []; }
};

const normalize = (s) => String(s).trim().toLowerCase();

/**
 * Vérifie si le user mérite de passer au niveau suivant.
 * Basé sur les QuizAttempts (sessions complètes uniquement).
 */
const checkLevelUp = async (userId, currentLevel) => {
  const currentIdx = LEVEL_ORDER.indexOf(currentLevel);
  if (currentIdx === LEVEL_ORDER.length - 1) return null;

  const attempts = await prisma.quizAttempt.findMany({
    where: {
      session:  { userId, status: 'COMPLETED' },
      question: { level: currentLevel },
    },
    select: { isCorrect: true },
  });

  const total   = attempts.length;
  const correct = attempts.filter((a) => a.isCorrect).length;

  if (total < LEVEL_UP_MIN_QUESTIONS)      return null;
  if (correct / total < LEVEL_UP_ACCURACY) return null;

  return LEVEL_ORDER[currentIdx + 1];
};

// ─── GET /api/quiz/categories ────────────────────────────────────────────────

export const getCategories = async (_req, res) => {
  return res.json({
    levels:     ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    categories: ['GRAMMAR', 'VOCABULARY', 'READING', 'LISTENING'],
  });
};

// ─── GET /api/quiz/questions ─────────────────────────────────────────────────
// Mode entraînement libre (sans session). Conservé pour compatibilité frontend.

export const getQuestions = async (req, res) => {
  const { level, category, lessonSlug, limit = 10 } = req.query;

  try {
    const where = {};
    if (level)      where.level      = level;
    if (category)   where.category   = category.toUpperCase();
    if (lessonSlug) where.lessonSlug = lessonSlug;

    const total = await prisma.question.count({ where });
    const skip  = Math.floor(Math.random() * Math.max(0, total - parseInt(limit)));

    const raw = await prisma.question.findMany({
      where,
      take: parseInt(limit),
      skip,
      select: {
        id: true, type: true, level: true, category: true,
        lessonSlug: true, question: true, choices: true, points: true,
      },
    });

    const questions = raw.map((q) => ({ ...q, choices: parseChoices(q.choices) }));
    return res.json({ questions });
  } catch (err) {
    console.error('[getQuestions]', err);
    return res.status(500).json({ error: 'Failed to fetch questions' });
  }
};

// ─── POST /api/quiz/sessions ──────────────────────────────────────────────────
// Crée une nouvelle session de quiz pour une lesson donnée.
// Body : { lessonSlug, limit? }
// Retourne : { session: { id, lessonSlug, questions[] } }

export const createSession = async (req, res) => {
  const userId = req.user.id;
  const { lessonSlug, limit = 10 } = req.body;

  if (!lessonSlug)
    return res.status(400).json({ error: 'lessonSlug is required' });

  try {
    // Mode libre : lessonSlug synthétique "free-A1" ou "free-A1-GRAMMAR"
    // Construit le filtre Prisma selon le slug reçu
    const isFreeMode = lessonSlug.startsWith('free-');
    let where;

    if (isFreeMode) {
      // "free-A1-GRAMMAR" → parts = ['free','A1','GRAMMAR']
      const parts = lessonSlug.split('-');
      const level    = parts[1] ?? null;
      const category = parts[2] ?? null;
      where = {};
      if (level)    where.level    = level;
      if (category) where.category = category;
    } else {
      where = { lessonSlug };
    }

    const total = await prisma.question.count({ where });
    if (total === 0)
      return res.status(404).json({ error: `No questions found for "${lessonSlug}"` });

    const take = Math.min(parseInt(limit), total);
    const skip = Math.floor(Math.random() * Math.max(0, total - take));

    const raw = await prisma.question.findMany({
      where,
      take,
      skip,
      select: {
        id: true, type: true, level: true, category: true,
        question: true, choices: true, points: true,
      },
    });

    const questions = raw.map((q) => ({ ...q, choices: parseChoices(q.choices) }));
    const maxScore  = questions.reduce((sum, q) => sum + q.points, 0);
    const questionIds = questions.map((q) => q.id);

    const session = await prisma.quizSession.create({
      data: {
        userId,
        lessonSlug,
        maxScore,
        questionIds,
      },
      select: { id: true, lessonSlug: true, status: true, maxScore: true, startedAt: true },
    });

    return res.status(201).json({ session, questions });
  } catch (err) {
    console.error('[createSession]', err);
    return res.status(500).json({ error: 'Failed to create quiz session' });
  }
};

// ─── POST /api/quiz/sessions/:sessionId/answer ────────────────────────────────
// Soumet la réponse à une question dans le cadre d'une session.
// Body : { questionId, userAnswer }

export const submitSessionAnswer = async (req, res) => {
  const userId    = req.user.id;
  const { sessionId } = req.params;
  const { questionId, userAnswer } = req.body;

  if (!questionId || userAnswer === undefined)
    return res.status(400).json({ error: 'questionId and userAnswer are required' });

  try {
    // Vérification : session appartient bien au user et est en cours
    const session = await prisma.quizSession.findFirst({
      where: { id: sessionId, userId, status: 'IN_PROGRESS' },
    });
    if (!session)
      return res.status(404).json({ error: 'Session not found or already completed' });

    // Vérification : question fait partie de cette session
    const ids = Array.isArray(session.questionIds) ? session.questionIds : JSON.parse(session.questionIds);
    if (!ids.includes(questionId))
      return res.status(400).json({ error: 'Question does not belong to this session' });

    // Vérification : pas déjà répondu
    const existing = await prisma.quizAttempt.findUnique({
      where: { sessionId_questionId: { sessionId, questionId } },
    });
    if (existing)
      return res.status(409).json({ error: 'Already answered in this session' });

    // Évaluation
    const question  = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) return res.status(404).json({ error: 'Question not found' });

    const isCorrect = normalize(userAnswer) === normalize(question.correctAnswer);
    const score     = isCorrect ? question.points : 0;

    await prisma.quizAttempt.create({
      data: { sessionId, questionId, userAnswer, isCorrect, score },
    });

    return res.json({
      isCorrect,
      score,
      correctAnswer: question.correctAnswer,
      explanation:   question.explanation,
    });
  } catch (err) {
    console.error('[submitSessionAnswer]', err);
    return res.status(500).json({ error: 'Failed to submit answer' });
  }
};

// ─── POST /api/quiz/sessions/:sessionId/complete ──────────────────────────────
// Clôture la session, calcule le score final, octroie l'XP et met à jour la progression.

export const completeSession = async (req, res) => {
  const userId        = req.user.id;
  const { sessionId } = req.params;

  try {
    const session = await prisma.quizSession.findFirst({
      where:   { id: sessionId, userId, status: 'IN_PROGRESS' },
      include: { attempts: { select: { score: true, isCorrect: true } } },
    });
    if (!session)
      return res.status(404).json({ error: 'Session not found or already completed' });

    const score    = session.attempts.reduce((sum, a) => sum + a.score, 0);
    const passed   = session.maxScore > 0 && score / session.maxScore >= QUIZ_PASS_THRESHOLD;
    const xpReward = passed ? Math.round(session.maxScore * 0.2) : 0; // 20% du max en XP

    // Récupère le niveau du user pour vérifier level-up
    const user = await prisma.user.findUnique({
      where:  { id: userId },
      select: { level: true, xp: true },
    });

    // Transaction atomique
    await prisma.$transaction(async (tx) => {
      // 1. Fermer la session
      await tx.quizSession.update({
        where: { id: sessionId },
        data: {
          status:      'COMPLETED',
          score,
          xpAwarded:   passed,
          completedAt: new Date(),
        },
      });

      if (passed) {
        // 2. Incrémenter XP user
        await tx.user.update({
          where: { id: userId },
          data:  { xp: { increment: xpReward } },
        });

        // 3. Marquer la lesson comme COMPLETED dans user_progress
        await tx.userProgress.upsert({
          where:  { userId_lessonId: { userId, lessonId: session.lessonSlug } },
          create: {
            userId,
            lessonId:    session.lessonSlug,
            status:      'COMPLETED',
            xpEarned:    xpReward,
            completedAt: new Date(),
          },
          update: {
            status:      'COMPLETED',
            xpEarned:    xpReward,
            completedAt: new Date(),
          },
        });
      }
    });

    // Vérification level-up (hors transaction pour éviter le deadlock)
    let levelUp = null;
    const newLevel = await checkLevelUp(userId, user.level);
    if (newLevel) {
      await prisma.user.update({
        where: { id: userId },
        data:  { level: newLevel },
      });
      levelUp = { from: user.level, to: newLevel };
    }

    return res.json({
      sessionId,
      score,
      maxScore:  session.maxScore,
      passed,
      xpAwarded: passed ? xpReward : 0,
      levelUp,
    });
  } catch (err) {
    console.error('[completeSession]', err);
    return res.status(500).json({ error: 'Failed to complete session' });
  }
};

// ─── GET /api/quiz/sessions/:sessionId ────────────────────────────────────────
// Récupère l'état d'une session (pour reprise ou résumé post-quiz).

export const getSession = async (req, res) => {
  const userId        = req.user.id;
  const { sessionId } = req.params;

  try {
    const session = await prisma.quizSession.findFirst({
      where:   { id: sessionId, userId },
      include: {
        attempts: {
          select: { questionId: true, isCorrect: true, score: true, answeredAt: true },
        },
      },
    });
    if (!session)
      return res.status(404).json({ error: 'Session not found' });

    const ids = Array.isArray(session.questionIds)
        ? session.questionIds
        : JSON.parse(session.questionIds);

    return res.json({
      session: {
        id:          session.id,
        lessonSlug:  session.lessonSlug,
        status:      session.status,
        score:       session.score,
        maxScore:    session.maxScore,
        xpAwarded:   session.xpAwarded,
        startedAt:   session.startedAt,
        completedAt: session.completedAt,
        totalQuestions:   ids.length,
        answeredQuestions: session.attempts.length,
      },
      attempts: session.attempts,
    });
  } catch (err) {
    console.error('[getSession]', err);
    return res.status(500).json({ error: 'Failed to fetch session' });
  }
};

// ─── POST /api/quiz/submit (rétrocompatibilité — mode libre) ─────────────────
// Conservé pour ne pas casser le frontend existant.
// Enregistre dans `attempts` (ancien modèle) sans session.

export const submitAnswer = async (req, res) => {
  const { questionId, userAnswer } = req.body;
  const userId = req.user.id;

  if (!questionId || userAnswer === undefined)
    return res.status(400).json({ error: 'questionId and userAnswer are required' });

  try {
    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) return res.status(404).json({ error: 'Question not found' });

    const isCorrect = normalize(userAnswer) === normalize(question.correctAnswer);
    const score     = isCorrect ? question.points : 0;

    await prisma.attempt.create({
      data: { userId, questionId, userAnswer, isCorrect, score },
    });

    let user = await prisma.user.findUnique({
      where:  { id: userId },
      select: { level: true, xp: true },
    });

    if (isCorrect) {
      user = await prisma.user.update({
        where:  { id: userId },
        data:   { xp: { increment: score } },
        select: { level: true, xp: true },
      });
    }

    let levelUp = null;
    if (question.level === user.level) {
      const newLevel = await checkLevelUp(userId, user.level);
      if (newLevel) {
        await prisma.user.update({ where: { id: userId }, data: { level: newLevel } });
        levelUp = { from: user.level, to: newLevel };
      }
    }

    return res.json({
      isCorrect,
      score,
      correctAnswer: question.correctAnswer,
      explanation:   question.explanation,
      levelUp,
    });
  } catch (err) {
    console.error('[submitAnswer]', err);
    return res.status(500).json({ error: 'Failed to submit answer' });
  }
};