import { workerData, parentPort } from 'worker_threads';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
ffmpeg.setFfmpegPath(ffmpegPath.path);

const resizeVideo = ({ inputPath, size }) => {
  const outputPath = `${inputPath.split('.')[0]}_${size}.mp4`;

  ffmpeg(inputPath)
    .audioCodec('libmp3lame')
    .videoCodec('libx264')
    .size(size)
  .on('error', (err) => console.log(`An error occurred: ${err.message}`))
  .on('end', () => parentPort.postMessage(outputPath))
  .save(outputPath);
};

parentPort.on('message', () => resizeVideo({ ...workerData, parentPort }));
