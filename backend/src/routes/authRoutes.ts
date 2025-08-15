import express from 'express';
import { register, login, getCurrentUser, getSecurityQuestion, verifySecurityAnswer, resetPassword, getTokenRemainingTime, getUserInfo } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Password reset routes
router.post('/security-question', getSecurityQuestion);
router.post('/verify-security-answer', verifySecurityAnswer);
router.post('/reset-password', resetPassword);
router.post('/token-remaining-time', getTokenRemainingTime);

// Get current user (protected route)
router.get('/me', authMiddleware, getCurrentUser);

// Get user info by ID (public route)
router.get('/users/:userId/info', getUserInfo);

export default router;