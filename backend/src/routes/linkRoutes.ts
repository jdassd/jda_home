import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  getUserLinks,
  getLinksByCategory,
  createLink,
  updateLink,
  deleteLink,
  reorderLinks
} from '../controllers/linkController';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get all links for the authenticated user
router.get('/', getUserLinks);

// Get links by category
router.get('/category/:categoryId', getLinksByCategory);

// Create a new link
router.post('/', createLink);

// Update a link
router.put('/:id', updateLink);

// Delete a link
router.delete('/:id', deleteLink);

// Reorder links within a category
router.put('/category/:categoryId/reorder', reorderLinks);

export default router;