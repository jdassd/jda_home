import express from 'express';
import authRoutes from './authRoutes';
import categoryRoutes from './categoryRoutes';

const router = express.Router();

// Import route handlers
// For now, we'll define a simple test route directly in this file
router.get('/', (req, res) => {
  res.json({ message: 'API is running!' });
});

// Register auth routes
router.use('/auth', authRoutes);

// Register category routes
router.use('/categories', categoryRoutes);

// Placeholder routes for future implementation
router.use('/users', (req, res) => {
  res.status(500).json({ message: 'Not implemented yet' });
});

router.use('/links', (req, res) => {
  res.status(500).json({ message: 'Not implemented yet' });
});

export default router;