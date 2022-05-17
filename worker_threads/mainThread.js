import { Worker, isMainThread } from 'worker_threads';
import EventEmitter from 'events';

const eventEmitter = new EventEmitter();
const VIDEO_SIZES = ['1600x900', '1440x900', '1280x800', '1280x720', '1024x768', '854x480', '800x600', '640x480', '640x360'];

export const compressVideoThreads = (inputPath = '/home/labaster/Desktop/1.mp4') => {
  if (isMainThread) {
    const compressedVideos = [];
    
    console.time('compressVideoThreads');
    VIDEO_SIZES.forEach((size) => {
      const worker = new Worker('./worker_threads/worker.js', {
        workerData: {
          inputPath,
          size,
        }
      });
      
      worker.postMessage('compressVideoThreads_start');

      worker.on('message', (outputPath) => {
        compressedVideos.push(outputPath);

        if (compressedVideos.length === VIDEO_SIZES.length) eventEmitter.emit('compressVideoThreads', compressedVideos);
      });
    });
    
    eventEmitter.on('compressVideoThreads', (videoPaths) => {
      console.timeEnd('compressVideoThreads');
      console.log(videoPaths);
      eventEmitter.removeListener('compressVideoThreads', () => console.log('compressVideoThreads listener removed!'));
      process.exit(1);
    });
  }
};

compressVideoThreads();
