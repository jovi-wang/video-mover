const fs = require('fs');
const youtubedl = require('@microlink/youtube-dl');

const video = youtubedl('https://www.youtube.com/watch?v=CzT9FR1RXW8',
  // Optional arguments passed to youtube-dl.
  ['--format=18'],
  // Additional options can be given for calling `child_process.execFile()`.
  { cwd: __dirname });
 
// console.log(video);  
// Will be called when the download starts.
video.on('info', (info) => {
  console.log('Download started');
  console.log(info.formats);
  console.log(`filename: ${info._filename}`);
  console.log(`size: ${info.size}`);
});
 
// video.pipe(fs.createWriteStream('myvideo.mp4'));
