import express from 'express';
import {
    getAllPosts,
    createPost,
    updatePost,
    deletePost,
    toggleLike,
    addComment,
} from '../controllers/communityController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All community routes require authentication
router.get('/posts', authenticateToken, getAllPosts);
router.post('/posts', authenticateToken, createPost);
router.put('/posts/:id', authenticateToken, updatePost);
router.delete('/posts/:id', authenticateToken, deletePost);
router.post('/posts/:id/like', authenticateToken, toggleLike);
router.post('/posts/:id/comment', authenticateToken, addComment);

export default router;
