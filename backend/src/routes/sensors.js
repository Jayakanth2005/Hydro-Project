import express from 'express';
import {
    getAllSensors,
    getSensorsByRegion,
    getSensorsByZone,
    getRealtimeSensors,
} from '../controllers/sensorController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All sensor routes require authentication
router.get('/', authenticateToken, getAllSensors);
router.get('/region/:id', authenticateToken, getSensorsByRegion);
router.get('/zone/:id', authenticateToken, getSensorsByZone);
router.get('/realtime', authenticateToken, getRealtimeSensors);

export default router;
