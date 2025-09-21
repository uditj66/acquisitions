import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '#controllers/user.controller.js';
import {
  authenticateToken,
  requireAdmin,
} from '#middlewares/auth.middleware.js';
import { Router } from 'express';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// Get all users
router.get('/', getAllUsers);

// Get user by ID
router.get('/:id', getUserById);

// Update user
router.put('/:id', updateUser);

// Delete user
router.delete('/:id', deleteUser);

export default router;
