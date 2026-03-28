// src/routes/dictionary.js
import { Router } from 'express';
import { getDictionaryBatch } from '../controllers/dictionaryController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/batch', authenticate, getDictionaryBatch);

export default router;