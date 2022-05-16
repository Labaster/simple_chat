import { Worker, isMainThread } from 'worker_threads';

const VIDEO_SIZES = ['1280x720', '854x480', '640x360'];

export const compressVideo = (inputPath = '/home/labaster/Desktop/1.mp4') => {
  if (isMainThread) {
    const compressedVideos = [];
    
    VIDEO_SIZES.forEach(async (size) => {
      new Promise((resolve, reject) => {
        const worker = new Worker('./worker_threads/worker.js', {
          workerData: {
            inputPath,
            size,
          }
        });
        
        worker.postMessage('start!!');
  
        worker.on('message', (outputPath) => {
          compressedVideos.push(outputPath);
          console.log(compressedVideos);
          resolve();
        });
        worker.on('error', reject);
        worker.on('exit', (code) => {
          if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
        });
      });
    });
  }
  
};
