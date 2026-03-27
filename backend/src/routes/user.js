// routes/user.js
import { Router } from 'express';
import {
    deleteAccount,
    getProfile,
    updatePassword,
    updateProfile,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, getProfile);           // → /api/user
router.patch('/profile', authenticate, updateProfile); // → /api/user/profile
router.patch('/password', authenticate, updatePassword); // → /api/user/password
router.delete('/account', authenticate, deleteAccount); // → /api/user/account

export default router;