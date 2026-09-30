import fs from "fs";
import path from "path";
import multer from "multer";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/spaces.js";
import { db } from "../config/db.js";
import  Image  from '../models/image.model.js';
// Multer temp storage
const upload1 = multer({ dest: "uploads/" });





/* =====================================================
   CREATE – Upload Image + Save Description
===================================================== */

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const { description } = req.body;

    if (!description || description.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Description is required",
      });
    }

    // 🔹 generate filename
    const ext = req.file.originalname.split(".").pop();
    const key = `images/${crypto.randomUUID()}.${ext}`;

    const fileName = `${Date.now()}-${req.file.originalname}`;

    // 🔹 upload to DigitalOcean Spaces
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: `Website/images/${fileName}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: "public-read",
      })
    );

    // 🔹 correct public URL
    const imageUrl = `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_REGION}.digitaloceanspaces.com/Website/images/${fileName}`;

    // 🔹 save to DB
    const [result] = await db.query(
      "INSERT INTO images (image_url, description) VALUES (?, ?)",
      [imageUrl, description]
    );

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        id: result.insertId,
        image_url: imageUrl,
        description,
      },
    });
  } catch (err) {
    console.error("UPLOAD IMAGE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }
};

/* =====================================================
   READ – Get All Images
===================================================== */
export const getAllImages = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, image_url, description, created_at FROM images ORDER BY created_at DESC"
    );

    return res.json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error("GET IMAGES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch images",
    });
  }
};

/* =====================================================
   UPDATE – Description Only
===================================================== */
export const updateText = async (req, res) => {
  try {
    const { id } = req.params;
    const description = req.body?.description;

    console.log("BODY:", req.body); // debug

    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Description is required",
      });
    }

    const [result] = await db.execute(
      "UPDATE images SET description = ? WHERE id = ?",
      [description, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    res.json({
      success: true,
      message: "Description updated successfully",
    });
  } catch (err) {
    console.error("UPDATE TEXT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/* =====================================================
   DELETE – Image from DO Spaces + DB
===================================================== */

export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Get image URL from DB
    const [rows] = await db.execute(
      "SELECT image_url FROM images WHERE id = ?",
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    const imageUrl = rows[0].image_url;

    // 2️⃣ Extract file key from URL
    const fileKey = imageUrl.split(".com/")[1]; 

    // 3️⃣ Delete from DigitalOcean Spaces
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: fileKey,
      })
    );

    // 4️⃣ Delete from DB
    await db.execute("DELETE FROM images WHERE id = ?", [id]);

    res.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (err) {
    console.error("DELETE IMAGE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete image",
    });
  }
};