import express from 'express';
import {
  registerAdmin,
  loginAdmin,
  getAdminProfile
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Protected routes
router.get('/profile', protect, getAdminProfile);

export default router; 