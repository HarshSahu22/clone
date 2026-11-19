import express from 'express';
import {
  getWishlists,
  getWishlist,
  createWishlist,
  addListingToWishlist,
  removeListingFromWishlist,
  toggleArchive,
  deleteWishlist
} from '../controllers/wishlist.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect); // Wishlist routes require auth

router.route('/').get(getWishlists).post(createWishlist);
router.route('/:id').get(getWishlist).delete(deleteWishlist);
router.put('/:id/archive', toggleArchive);
router.post('/:id/listings/:listingId', addListingToWishlist);
router.delete('/:id/listings/:listingId', removeListingFromWishlist);

export default router;

