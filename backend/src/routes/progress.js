import {Router} from 'express';
import {getLeaderboard, getProgress, updateProgress,} from '../controllers/progressController.js';
import {authenticate} from '../middleware/auth.js';

const router = Router();

router.get('/',              authenticate, getProgress);
router.get('/leaderboard',   authenticate, getLeaderboard);
router.patch('/:lessonId',   authenticate, updateProgress);

export default router;