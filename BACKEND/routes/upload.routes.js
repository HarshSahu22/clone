import express from 'express';
import { upload, uploadSingle, uploadMultiple } from '../controllers/upload.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect); // File uploads require authentication

router.post('/image', upload.single('image'), uploadSingle);
router.post('/images', upload.array('images', 10), uploadMultiple);

export default router;

