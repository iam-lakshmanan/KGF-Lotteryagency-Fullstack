import fs from "fs";
import multer from "multer";
import {
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import path from "path";

import { s3 } from "../config/spaces.js";
import { db } from "../config/db.js";
import { compressVideo } from "../utils/videoCompress.js"; 

// Multer temp storage
const upload = multer({ dest: "uploads/" });

/* =====================================================
   CREATE – Upload Video + Thumbnail + Description
===================================================== */
// export const uploadVideo = [
//   async (req, res) => {
//     try {
//       // 1. FIX: Use 'thumbnailimage' to match your Multer filter
//       if (!req.files?.video || !req.files?.thumbnailimage) {
//         return res.status(400).json({
//           success: false,
//           message: "Video and thumbnailimage are required",
//         });
//       }

//       const videoFile = req.files.video[0];
//       const thumbFile = req.files.thumbnailimage[0]; // FIX HERE TOO
//       const { description } = req.body;

//       // ⚠️ IMPORTANT: If you want to use compressVideo(videoFile.path), 
//       // you MUST change your multer storage from memoryStorage() to diskStorage()
//       // otherwise videoFile.path will be undefined.

//       const videoName = `${Date.now()}-${videoFile.originalname}`;
//       const thumbName = `${Date.now()}-${thumbFile.originalname}`;

//       // 🔹 Upload VIDEO to DO Spaces
//       await s3.send(
//         new PutObjectCommand({
//           Bucket: process.env.DO_SPACES_BUCKET,
//           Key: `Website/videos/${videoName}`,
//           Body: videoFile.buffer, // Works with memoryStorage
//           ContentType: videoFile.mimetype,
//           ACL: "public-read",
//         })
//       );

//       // 🔹 Upload THUMBNAIL to DO Spaces
//       await s3.send(
//         new PutObjectCommand({
//           Bucket: process.env.DO_SPACES_BUCKET,
//           Key: `Website/thumbnailimage/${thumbName}`,
//           Body: thumbFile.buffer,
//           ContentType: thumbFile.mimetype,
//           ACL: "public-read",
//         })
//       );

//       // ✅ URLs
//       const videoUrl = `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_ENDPOINT}/Website/videos/${videoName}`;
//       const thumbnailUrl = `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_ENDPOINT}/Website/thumbnailimage/${thumbName}`;

//       // ✅ Save to DB (MySQL)
//       await db.execute(
//         `INSERT INTO videos (video_url, thumbnail_url, description)
//          VALUES (?, ?, ?)`,
//         [videoUrl, thumbnailUrl, description]
//       );

//       res.json({
//         success: true,
//         message: "Video and thumbnail uploaded successfully",
//         video_url: videoUrl,
//         thumbnail_url: thumbnailUrl,
//       });
//     } catch (err) {
//       console.error("UPLOAD VIDEO ERROR:", err);
//       res.status(500).json({ success: false, message: "Upload failed" });
//     }
//   }
// ];

export const uploadVideo = async (req, res) => {
  let tempVideoPath = null;
  let compressedVideoPath = null;
  let tempThumbPath = null;

  try {
    // 1. Validate Files
    if (!req.files?.video || !req.files?.thumbnailimage) {
      return res.status(400).json({ success: false, message: "Missing files" });
    }

    const videoFile = req.files.video[0];
    const thumbFile = req.files.thumbnailimage[0];
    const { description } = req.body;

    tempVideoPath = videoFile.path;
    tempThumbPath = thumbFile.path;

    // 2. Compress Video (Wait for FFmpeg to finish)
    compressedVideoPath = await compressVideo(tempVideoPath);

    const videoName = `vid-${Date.now()}.mp4`;
    const thumbName = `thumb-${Date.now()}${path.extname(thumbFile.originalname)}`;

    // 3. Upload Compressed Video to DO Spaces
    const compressedStream = fs.createReadStream(compressedVideoPath);
    await s3.send(new PutObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: `Website/videos/${videoName}`,
      Body: compressedStream,
      ContentType: "video/mp4",
      ACL: "public-read",
    }));

    // 4. Upload Thumbnail to DO Spaces
    const thumbStream = fs.createReadStream(tempThumbPath);
    await s3.send(new PutObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: `Website/thumbnailimage/${thumbName}`,
      Body: thumbStream,
      ContentType: thumbFile.mimetype,
      ACL: "public-read",
    }));

    const videoUrl = `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_ENDPOINT}/Website/videos/${videoName}`;
    const thumbnailUrl = `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_ENDPOINT}/Website/thumbnailimage/${thumbName}`;

    // 5. Save to DB
    await db.execute(
      `INSERT INTO videos (video_url, thumbnail_url, description) VALUES (?, ?, ?)`,
      [videoUrl, thumbnailUrl, description]
    );

    // 6. Cleanup Local Files (Crucial for Disk Space)
    [tempVideoPath, compressedVideoPath, tempThumbPath].forEach(p => {
      if (p && fs.existsSync(p)) fs.unlinkSync(p);
    });

    res.json({ success: true, video_url: videoUrl, thumbnail_url: thumbnailUrl });

  } catch (err) {
    console.error("CRITICAL UPLOAD ERROR:", err);
    
    // Cleanup on error
    [tempVideoPath, compressedVideoPath, tempThumbPath].forEach(p => {
      if (p && fs.existsSync(p)) fs.unlinkSync(p);
    });

    res.status(500).json({ success: false, message: "Video processing failed" });
  }
};
/* =====================================================
   READ – Get All Videos
===================================================== */
export const getVideos = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, video_url, thumbnail_url, description, created_at
       FROM videos
       ORDER BY created_at DESC`
    );

    return res.json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error("GET VIDEOS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch videos",
    });
  }
};

/* =====================================================
   UPDATE – Description Only
===================================================== */
export const updateVideoDescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Description is required",
      });
    }

    const [result] = await db.query(
      "UPDATE videos SET description=? WHERE id=?",
      [description, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    return res.json({
      success: true,
      message: "Description updated",
    });
  } catch (error) {
    console.error("UPDATE VIDEO ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};

/* =====================================================
   DELETE – Video + Thumbnail + DB
===================================================== */
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const [[video]] = await db.query(
      "SELECT video_url, thumbnail_url FROM videos WHERE id=?",
      [id]
    );

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const videoKey = video.video_url.split(".com/")[1];
    const thumbKey = video.thumbnail_url.split(".com/")[1];

    // Delete video
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: videoKey,
      })
    );

    // Delete thumbnail
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: thumbKey,
      })
    );

    // Delete DB record
    await db.query("DELETE FROM videos WHERE id=?", [id]);

    return res.json({
      success: true,
      message: "Video deleted",
    });
  } catch (error) {
    console.error("DELETE VIDEO ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};