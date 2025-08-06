// routes/courseRoutes.js

import express from "express";
import { getMyCourses } from "../controllers/course.controller.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/my-courses", authenticateUser, getMyCourses);

export default router;
