import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
  getPublicCategories
} from '../controllers/categoryController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes (no authentication required)
// Get public categories for a specific user
router.get('/public/:userId', getPublicCategories);

// Protected routes (authentication required)
// Get all categories for the authenticated user
router.get('/', authMiddleware, getCategories);

// Create a new category
router.post('/', authMiddleware, createCategory);

// Update a category
router.put('/:id', authMiddleware, updateCategory);

// Delete a category
router.delete('/:id', authMiddleware, deleteCategory);

// Reorder categories
router.post('/reorder', authMiddleware, reorderCategories);

export default router;