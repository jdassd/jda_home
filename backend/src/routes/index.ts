import express from 'express';
const router = express.Router();

// Import route handlers
// For now, we'll define a simple test route directly in this file
router.get('/', (req, res) => {
  res.json({ message: 'API is running!' });
});

// Placeholder routes for future implementation
router.use('/auth', (req, res) => {
  res.status(500).json({ message: 'Not implemented yet' });
});

router.use('/users', (req, res) => {
  res.status(500).json({ message: 'Not implemented yet' });
});

router.use('/links', (req, res) => {
  res.status(500).json({ message: 'Not implemented yet' });
});

router.use('/categories', (req, res) => {
  res.status(500).json({ message: 'Not implemented yet' });
});

export default router;