import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  phoneLogin,
  socialLogin,
  getMe,
  logout
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

const router = express.Router();

router.post(
  '/register',
  [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
  ],
  login
);

router.post(
  '/phone-login',
  [
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    validate
  ],
  phoneLogin
);

router.post('/social', socialLogin);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;

