import express from 'express';
import {
  getBusinesses,
  getBusiness,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  getNearbyBusinesses
} from '../controllers/businessController.js';

const router = express.Router();

// Search nearby businesses
router.get('/near', getNearbyBusinesses);

// Main business routes
router.route('/')
  .get(getBusinesses)
  .post(createBusiness);

// Single business routes
router.route('/:id')
  .get(getBusiness)
  .put(updateBusiness)
  .delete(deleteBusiness);

export default router; 