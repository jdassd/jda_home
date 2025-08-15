import express from 'express';
import { register, login, getCurrentUser, getSecurityQuestion, resetPassword } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Password reset routes
router.post('/security-question', getSecurityQuestion);
router.post('/reset-password', resetPassword);

// Get current user (protected route)
router.get('/me', authMiddleware, getCurrentUser);

export default router;