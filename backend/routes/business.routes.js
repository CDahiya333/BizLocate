import express from 'express';
import {
  getBusinesses,
  getBusiness,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  getNearbyBusinesses
} from '../controllers/business.controller.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

// Search nearby businesses
router.get('/near', getNearbyBusinesses);

// Main business routes
router.route('/')
  .get(getBusinesses)
  .post(upload.single('profileImage'), createBusiness);

// Single business routes
router.route('/:id')
  .get(getBusiness)
  .put(upload.single('profileImage'), updateBusiness)
  .delete(deleteBusiness);

export default router; 