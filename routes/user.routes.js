import express from 'express';
import { buyCourse } from '../controllers/user.controller.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/buy-course', authenticateUser, buyCourse); // ✅ POST /api/user/buy-course

export default router;
