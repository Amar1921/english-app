import { Router } from 'express';
import {
  getCategories,
  getQuestions,
  submitAnswer,       // rétrocompat — mode libre
  createSession,
  submitSessionAnswer,
  completeSession,
  getSession,
} from '../controllers/quizController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// ── Mode entraînement libre (rétrocompatibilité) ─────────────────────────────
router.get('/categories',  authenticate, getCategories);
router.get('/',            authenticate, getQuestions);
router.post('/submit',     authenticate, submitAnswer);

// ── Sessions de quiz (nouveau flow) ──────────────────────────────────────────
router.post  ('/sessions',                       authenticate, createSession);
router.get   ('/sessions/:sessionId',            authenticate, getSession);
router.post  ('/sessions/:sessionId/answer',     authenticate, submitSessionAnswer);
router.post  ('/sessions/:sessionId/complete',   authenticate, completeSession);

export default router;
