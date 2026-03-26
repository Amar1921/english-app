// src/routes/auth.js
import { Router } from 'express';
import {
  register,
  login,
  getMe,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register',             authLimiter, register);
router.post('/login',                authLimiter, login);
router.post('/verify-email',         authLimiter, verifyEmail);
router.post('/resend-verification',  authLimiter, resendVerification);
router.post('/forgot-password',      authLimiter, forgotPassword);
router.post('/reset-password',       authLimiter, resetPassword);
router.get('/me',                    authenticate, getMe);

export default router;
