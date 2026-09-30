import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import path from "path";

ffmpeg.setFfmpegPath(ffmpegPath);

export const compressVideo = (inputPath) => {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(
      path.dirname(inputPath),
      `compressed-${Date.now()}.mp4`
    );

    ffmpeg(inputPath)
      .outputOptions([
      "-vcodec libx264",
       "-crf 24",            // Lowered from 28 for better detail preservation
       "-preset veryfast",   // Changed from 'ultrafast' for better compression efficiency
       "-vf scale=-2:720",   // Keeps it at 720p (best for mobile/web balance)
       "-b:v 3M",            // Increased from 1.5M to 3M for double the detail
       "-maxrate 3M",
       "-bufsize 6M",        // Buffer should be 2x the bitrate
       "-movflags +faststart",
        "-threads 0"
      ])
      .on("start", () => {
        console.log("🎥 Compression started...");
      })
      .on("progress", (progress) => {
        
        if (progress.percent) {
          console.clear(); 
          console.log(`🚀 Compressing Video: ${Math.round(progress.percent)}% complete`);
        }
      })
      .on("end", () => {
        console.log("✅ Compression finished!");
        resolve(outputPath);
      })
      .on("error", (err) => {
        console.error("❌ FFmpeg Error:", err.message);
        reject(err);
      })
      .save(outputPath); 
  });
};