import express from 'express';
import {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  getMyListings,
  getCategories
} from '../controllers/listing.controller.js';
import { protect, optionalAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/categories', getCategories);
router.get('/', optionalAuth, getListings);
router.get('/my/listings', protect, getMyListings);
router.get('/:id', optionalAuth, getListing);

// Protected routes
router.use(protect);
router.post('/', createListing);
router.put('/:id', updateListing);
router.delete('/:id', deleteListing);

export default router;

