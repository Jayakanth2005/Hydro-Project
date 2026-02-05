import express from 'express';
import {
    getAllReports,
    createReport,
    getReportById,
} from '../controllers/reportController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All report routes require authentication
router.get('/', authenticateToken, getAllReports);
router.post('/', authenticateToken, createReport);
router.get('/:id', authenticateToken, getReportById);

export default router;
