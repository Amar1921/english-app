import {Router} from 'express';
import {getCategories, getQuestions, submitAnswer} from '../controllers/quizController.js';
import {authenticate} from '../middleware/auth.js';

const router = Router();

router.get('/categories', authenticate, getCategories);
router.get('/', authenticate, getQuestions);
router.post('/submit', authenticate, submitAnswer);

export default router;
