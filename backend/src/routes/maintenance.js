import express from 'express';
import {
    getAllMaintenance,
    createMaintenance,
    updateMaintenance,
    createGovernmentMaintenance,
    getGovernmentMaintenance,
} from '../controllers/maintenanceController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All maintenance routes require authentication
router.get('/', authenticateToken, getAllMaintenance);
router.get('/government', authenticateToken, getGovernmentMaintenance);
router.post('/', authenticateToken, createMaintenance);
router.post('/government', authenticateToken, createGovernmentMaintenance);
router.put('/:id', authenticateToken, updateMaintenance);

export default router;
