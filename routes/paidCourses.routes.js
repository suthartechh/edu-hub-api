
import express from 'express';
import { getPaidCourses } from '../controllers/paidCourses.controller.js';

const router = express.Router();

router.get('/paid-courses', getPaidCourses);

export default router;
