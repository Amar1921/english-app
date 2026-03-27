import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Import robuste — fonctionne peu importe la structure de dossiers
const prisma = new PrismaClient();

// ─── GET /api/user ─────────────────────────────────────────────────────────
// ─── PATCH /api/user/profile ───────────────────────────────────────────────
export const updateProfile = async (req, res) => {
    const userId = req.user.id;
    const { name, email } = req.body;

    if (!name?.trim() && !email?.trim())
        return res.status(400).json({ error: 'At least one field (name or email) is required' });

    try {
        if (email) {
            const existing = await prisma.user.findFirst({
                where: { email, NOT: { id: userId } },
            });
            if (existing) return res.status(409).json({ error: 'Email already in use' });
        }

        const updated = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(name?.trim()  ? { name:  name.trim()  } : {}),
                ...(email?.trim() ? { email: email.trim() } : {}),
            },
            select: { id: true, name: true, email: true, level: true, xp: true, streak: true },
        });

        return res.json({ user: updated });
    } catch (err) {
        console.error('[updateProfile]', err);
        return res.status(500).json({ error: 'Failed to update profile' });
    }
};

// ─── PATCH /api/user/password ──────────────────────────────────────────────
export const updatePassword = async (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
        return res.status(400).json({ error: 'currentPassword and newPassword are required' });
    if (newPassword.length < 8)
        return res.status(400).json({ error: 'New password must be at least 8 characters' });

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const valid = await bcrypt.compare(currentPassword, user.password);
        if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });

        const hashed = await bcrypt.hash(newPassword, 12);
        await prisma.user.update({
            where: { id: userId },
            data:  { password: hashed },
        });

        return res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('[updatePassword]', err);
        return res.status(500).json({ error: 'Failed to update password' });
    }
};

// ─── DELETE /api/user/account ──────────────────────────────────────────────
export const deleteAccount = async (req, res) => {
    const userId = req.user.id;
    const { password } = req.body;

    if (!password) return res.status(400).json({ error: 'Password is required to delete account' });

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Incorrect password' });

        await prisma.user.delete({ where: { id: userId } });
        return res.json({ message: 'Account deleted successfully' });
    } catch (err) {
        console.error('[deleteAccount]', err);
        return res.status(500).json({ error: 'Failed to delete account' });
    }
};

// controllers/userController.js
export const getProfile = async (req, res) => {
    try {
        const userId = parseInt(req.user.id);

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                level: true,
                xp: true,
                streak: true,
                isVerified: true,
                createdAt: true,
                lastLogin: true,
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Structure attendue par le frontend
        res.json({
            user: {
                ...user,
                createdAt: user.createdAt.toISOString(),
                lastLogin: user.lastLogin?.toISOString(),
            },
            stats: {
                totalXp: user.xp,
                quiz: {
                    totalAnswered: 0,
                    totalCorrect: 0,
                    accuracy: 0,
                    totalXpQuiz: 0,
                },
                lessons: {
                    completed: 0,
                    inProgress: 0,
                    totalXpLessons: 0,
                },
                byCategory: {},
                favouriteCategory: null,
            },
            lessonProgress: [],
            recentActivity: [],
        });

    } catch (error) {
        console.error('Error in getProfile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

