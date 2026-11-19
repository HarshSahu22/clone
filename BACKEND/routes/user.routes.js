import express from 'express';
import {
  getUserProfile,
  updateProfile,
  updateBio,
  updatePassword,
  becomeHost,
  getActivity,
  deleteAccount
} from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/:id', getUserProfile);

// Authenticated user operations
router.use(protect);
router.put('/profile', updateProfile);
router.put('/bio', updateBio);
router.put('/password', updatePassword);
router.put('/become-host', becomeHost);
router.get('/account/activity', getActivity);
router.delete('/account', deleteAccount);

export default router;

