import { Router } from 'express';
import { getProgress, getLeaderboard } from '../controllers/progressController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, getProgress);
router.get('/leaderboard', authenticate, getLeaderboard);

export default router;
