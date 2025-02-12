import express from 'express';
import { simulateScheduling } from '../controllers/scheduleController.js';

const router = express.Router();

router.post('/simulate', simulateScheduling);

export default router;