import { Router } from 'express';
import { getLessons, getLesson } from '../controllers/lessonsController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, getLessons);
router.get('/:slug', authenticate, getLesson);

export default router;
