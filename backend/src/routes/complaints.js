import express from 'express';
import {
    getAllComplaints,
    createComplaint,
    updateComplaint,
    deleteComplaint,
} from '../controllers/complaintController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All complaint routes require authentication
router.get('/', authenticateToken, getAllComplaints);
router.post('/', authenticateToken, createComplaint);
router.put('/:id', authenticateToken, updateComplaint);
router.delete('/:id', authenticateToken, deleteComplaint);

export default router;
