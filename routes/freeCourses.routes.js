import express from 'express';
import { getFreeCourses } from '../controllers/freeCourses.controller.js';

const router = express.Router();

router.get('/free-courses', getFreeCourses);

export default router;
