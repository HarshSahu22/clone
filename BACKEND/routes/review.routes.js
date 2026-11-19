import express from 'express';
import {
  getListingReviews,
  createReview,
  respondToReview,
  deleteReview
} from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/listing/:listingId', getListingReviews);

// Protected routes
router.use(protect);
router.post('/', createReview);
router.put('/:id/respond', respondToReview);
router.delete('/:id', deleteReview);

export default router;

