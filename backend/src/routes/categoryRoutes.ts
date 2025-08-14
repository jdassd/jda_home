import express from 'express';
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  reorderCategories 
} from '../controllers/categoryController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// All category routes require authentication
router.use(authMiddleware);

// Get all categories for the authenticated user
router.get('/', getCategories);

// Create a new category
router.post('/', createCategory);

// Update a category
router.put('/:id', updateCategory);

// Delete a category
router.delete('/:id', deleteCategory);

// Reorder categories
router.post('/reorder', reorderCategories);

export default router;