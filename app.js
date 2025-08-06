// app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import freeCourseRoutes from "./routes/freeCourses.routes.js";
import paidCourseRoutes from "./routes/paidCourses.routes.js";
import videoRoutes from "./routes/video.routes.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import payment from "./routes/payment.routes.js";

import { buyCourse } from "./controllers/user.controller.js";

import courseRoutes from "./routes/course.routes.js";

dotenv.config();
connectDB();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json()); // Needed to parse req.body

app.get("/", (req, res) => res.send("✅ API is running"));
app.get("/api", (req, res) => res.send("✅ API is running"));

app.use("/api/auth", authRoutes);

app.use("/api", freeCourseRoutes);
app.use("/api", paidCourseRoutes);
app.use("/api/video", videoRoutes);

app.use("/api/user", buyCourse);
app.use("/api/", courseRoutes);

// payment route
app.use('/api/payment', payment);

export default app;
