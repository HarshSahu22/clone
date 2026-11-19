import express from 'express';
import { getEarningsEstimate } from '../controllers/hosting.controller.js';

const router = express.Router();

router.get('/earnings-estimate', getEarningsEstimate);

export default router;

