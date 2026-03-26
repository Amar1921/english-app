// src/controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../prisma.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/mailService.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

/** Génère un code numérique à 6 chiffres */
const generateCode = () =>
  String(Math.floor(100000 + Math.random() * 900000));

/** Expiration : maintenant + N minutes */
const expiresInMinutes = (n) =>
  new Date(Date.now() + n * 60 * 1000);

// ─── Register ─────────────────────────────────────────────────────────────────

export const register = async (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password)
    return res.status(400).json({ error: 'All fields are required' });

  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters' });

  try {
    const exists = await prisma.user.findUnique({ where: { email } });

    // Si l'utilisateur existe mais n'est pas vérifié → renvoyer un nouveau code
    if (exists && !exists.isVerified) {
      const code = generateCode();
      await prisma.user.update({
        where: { email },
        data: {
          verifyCode: code,
          verifyCodeExpires: expiresInMinutes(15),
        },
      });
      await sendVerificationEmail(email, exists.name, code);
      return res.status(200).json({
        pendingVerification: true,
        message: 'A new verification code has been sent to your email.',
      });
    }

    if (exists) return res.status(409).json({ error: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 12);
    const code = generateCode();

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashed,
        isVerified: false,
        verifyCode: code,
        verifyCodeExpires: expiresInMinutes(15),
      },
    });

    await sendVerificationEmail(email, name, code);

    return res.status(201).json({
      pendingVerification: true,
      message: 'Account created. Please check your email to verify your account.',
    });
  } catch (err) {
    console.error('[register]', err);
    return res.status(500).json({ error: 'Registration failed' });
  }
};

// ─── Verify Email ─────────────────────────────────────────────────────────────

export const verifyEmail = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code)
    return res.status(400).json({ error: 'Email and code are required' });

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user)
      return res.status(404).json({ error: 'User not found' });

    if (user.isVerified)
      return res.status(400).json({ error: 'Account is already verified' });

    if (!user.verifyCode || user.verifyCode !== code)
      return res.status(400).json({ error: 'Invalid verification code' });

    if (!user.verifyCodeExpires || user.verifyCodeExpires < new Date())
      return res.status(400).json({ error: 'Verification code has expired' });

    const updated = await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        verifyCode: null,
        verifyCodeExpires: null,
      },
    });

    const token = signToken(updated);
    const { password: _, verifyCode: __, verifyCodeExpires: ___, resetToken: ____, resetTokenExpires: _____, ...safeUser } = updated;

    return res.json({ token, user: safeUser });
  } catch (err) {
    console.error('[verifyEmail]', err);
    return res.status(500).json({ error: 'Verification failed' });
  }
};

// ─── Resend Verification Code ─────────────────────────────────────────────────

export const resendVerification = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.isVerified) return res.status(400).json({ error: 'Account already verified' });

    const code = generateCode();
    await prisma.user.update({
      where: { email },
      data: { verifyCode: code, verifyCodeExpires: expiresInMinutes(15) },
    });

    await sendVerificationEmail(email, user.name, code);
    return res.json({ message: 'Verification code resent' });
  } catch (err) {
    console.error('[resendVerification]', err);
    return res.status(500).json({ error: 'Failed to resend code' });
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required' });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    // Bloquer si non vérifié
    if (!user.isVerified) {
      return res.status(403).json({
        error: 'Please verify your email before logging in.',
        pendingVerification: true,
        email,
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const token = signToken(user);
    const { password: _, verifyCode: __, verifyCodeExpires: ___, resetToken: ____, resetTokenExpires: _____, ...safeUser } = user;
    return res.json({ token, user: safeUser });
  } catch (err) {
    console.error('[login]', err);
    return res.status(500).json({ error: 'Login failed' });
  }
};

// ─── Forgot Password ──────────────────────────────────────────────────────────

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    // Réponse générique pour ne pas révéler si l'email existe
    if (!user || !user.isVerified) {
      return res.json({ message: 'If this email is registered, you will receive a reset code.' });
    }

    const code = generateCode();
    await prisma.user.update({
      where: { email },
      data: {
        resetToken: code,
        resetTokenExpires: expiresInMinutes(15),
      },
    });

    await sendPasswordResetEmail(email, user.name, code);
    return res.json({ message: 'If this email is registered, you will receive a reset code.' });
  } catch (err) {
    console.error('[forgotPassword]', err);
    return res.status(500).json({ error: 'Failed to process request' });
  }
};

// ─── Reset Password ───────────────────────────────────────────────────────────

export const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword)
    return res.status(400).json({ error: 'All fields are required' });

  if (newPassword.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters' });

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user)
      return res.status(404).json({ error: 'User not found' });

    if (!user.resetToken || user.resetToken !== code)
      return res.status(400).json({ error: 'Invalid reset code' });

    if (!user.resetTokenExpires || user.resetTokenExpires < new Date())
      return res.status(400).json({ error: 'Reset code has expired' });

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { email },
      data: {
        password: hashed,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    return res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    console.error('[resetPassword]', err);
    return res.status(500).json({ error: 'Failed to reset password' });
  }
};

// ─── Get Me ───────────────────────────────────────────────────────────────────

export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, email: true, name: true,
        level: true, xp: true, streak: true,
        isVerified: true,
        createdAt: true, lastLogin: true,
        _count: { select: { attempts: true } },
      },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
};
