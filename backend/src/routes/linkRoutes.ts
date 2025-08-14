import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  getUserLinks,
  getLinksByCategory,
  createLink,
  updateLink,
  deleteLink,
  reorderLinks,
  getPublicLinks,
  getPublicLinksByCategory
} from '../controllers/linkController';

const router = Router();

// Public routes (no authentication required)
// Get public links for a specific user
router.get('/public/:userId', getPublicLinks);

// Get public links by category
router.get('/public/:userId/category/:categoryId', getPublicLinksByCategory);

// Protected routes (authentication required)
// Get all links for the authenticated user
router.get('/', authMiddleware, getUserLinks);

// Get links by category
router.get('/category/:categoryId', authMiddleware, getLinksByCategory);

// Create a new link
router.post('/', authMiddleware, createLink);

// Update a link
router.put('/:id', authMiddleware, updateLink);

// Delete a link
router.delete('/:id', authMiddleware, deleteLink);

// Reorder links within a category
router.put('/category/:categoryId/reorder', authMiddleware, reorderLinks);

export default router;