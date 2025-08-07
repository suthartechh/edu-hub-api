// controllers/video.controller.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const streamVideoFile = (req, res) => {
  const {  course, filename } = req.params;
  const filePath = path.join(__dirname, `../uploads/hls/${course}/${filename}`);


  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }

  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.m3u8') {
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
  } else if (ext === '.ts') {
    res.setHeader('Content-Type', 'video/MP2T');
  } else {
    res.setHeader('Content-Type', 'application/octet-stream');
  }

  res.sendFile(filePath);
};
