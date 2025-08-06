// routes/video.routes.js
import express from 'express';
import { streamVideoFile } from '../controllers/video.controller.js';

const router = express.Router();

// Correct relative path
router.get('/:course/:filename', streamVideoFile); // ✅ Example: /api/video/react-js/basics/playlist.m3u8

export default router;
