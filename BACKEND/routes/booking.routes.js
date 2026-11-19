import express from 'express';
import {
  createBooking,
  getMyBookings,
  getHostReservations,
  getBooking,
  cancelBooking
} from '../controllers/booking.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect); // All booking routes require authentication

router.post('/', createBooking);
router.get('/my-trips', getMyBookings);
router.get('/host-reservations', getHostReservations);
router.get('/:id', getBooking);
router.put('/:id/cancel', cancelBooking);

export default router;

