import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📌 Input Video
const inputPath = path.join(__dirname, 'uploads', 'video2.mp4');
const videoName = path.parse(inputPath).name; // ➜ video2

// 📁 Output Directory: /uploads/video2
const outputDir = path.join(__dirname, 'uploads', videoName);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🔄 Converting to HLS with multiple qualities...');

const proc = ffmpeg(inputPath, { timeout: 432000 })
  .addOption('-preset', 'fast')
  .addOption('-g', '48')
  .addOption('-sc_threshold', '0')

  // 🎞️ 1080p
  .output(`${outputDir}/1080p.m3u8`)
  .videoCodec('libx264')
  .audioCodec('aac')
  .size('1920x1080')
  .videoBitrate('5000k')
  .audioBitrate('192k')
  .addOptions([
    '-hls_time 10',
    '-hls_list_size 0',
    '-hls_segment_filename', `${outputDir}/1080p_%03d.ts`,
    '-f hls',
  ])

  // 🎞️ 720p
  .output(`${outputDir}/720p.m3u8`)
  .videoCodec('libx264')
  .audioCodec('aac')
  .size('1280x720')
  .videoBitrate('3000k')
  .audioBitrate('128k')
  .addOptions([
    '-hls_time 10',
    '-hls_list_size 0',
    '-hls_segment_filename', `${outputDir}/720p_%03d.ts`,
    '-f hls',
  ])

  // 🎞️ 480p
  .output(`${outputDir}/480p.m3u8`)
  .videoCodec('libx264')
  .audioCodec('aac')
  .size('854x480')
  .videoBitrate('1000k')
  .audioBitrate('96k')
  .addOptions([
    '-hls_time 10',
    '-hls_list_size 0',
    '-hls_segment_filename', `${outputDir}/480p_%03d.ts`,
    '-f hls',
  ])

  // ✅ On Progress
  .on('progress', progress => {
    const percent = progress.percent?.toFixed(2);
    if (percent) {
      process.stdout.write(`\r⏳ Converting: ${percent}%`);
    }
  })

  // ✅ On Finish
  .on('end', () => {
    console.log('\n✅ All variants created. Now generating master playlist...');
    generateMasterPlaylist();
  })

  // ❌ On Error
  .on('error', err => {
    console.error('\n❌ FFmpeg Error:', err.message);
  })

  .run();

// 📜 Generate Master Playlist
function generateMasterPlaylist() {
  const masterPath = path.join(outputDir, 'playlist.m3u8');
  const content = `
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=5500000,RESOLUTION=1920x1080
1080p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=3500000,RESOLUTION=1280x720
720p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=1500000,RESOLUTION=854x480
480p.m3u8
  `.trim();

  fs.writeFileSync(masterPath, content);
  console.log('✅ Master playlist created:', masterPath);
}
