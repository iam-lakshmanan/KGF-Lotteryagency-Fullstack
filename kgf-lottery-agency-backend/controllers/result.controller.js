// controllers/result.controller.js
import fs from "fs";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/spaces.js";
import { db } from "../config/db.js";

/* ================= CREATE RESULT ================= */
export const createResult = [
  async (req, res) => {
    try {
      // 1. Authorization Check (Bearer Token)
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { publisherName, publishDate } = req.body;
      const imageFile = req.files?.image?.[0];
      const pdfFile = req.files?.pdf?.[0];

      if (!publisherName || !publishDate || !imageFile || !pdfFile) {
        return res.status(400).json({ success: false, message: "All fields are required" });
      }

      // 2. THE DATE FIX: Force the date to be YYYY-MM-DD string only
      // This prevents MySQL from adding hours/minutes that flip the day
      const sanitizedDate = publishDate.split('T')[0];

      const imageKey = `Website/result-images/${Date.now()}-${imageFile.originalname}`;
      const pdfKey = `Website/result-pdfs/${Date.now()}-${pdfFile.originalname}`;

      // Upload image & pdf to DigitalOcean Spaces
      await s3.send(new PutObjectCommand({
          Bucket: process.env.DO_SPACES_BUCKET,
          Key: imageKey,
          Body: fs.createReadStream(imageFile.path),
          ACL: "public-read",
          ContentType: imageFile.mimetype,
      }));

      await s3.send(new PutObjectCommand({
          Bucket: process.env.DO_SPACES_BUCKET,
          Key: pdfKey,
          Body: fs.createReadStream(pdfFile.path),
          ACL: "public-read",
          ContentType: pdfFile.mimetype,
      }));

      const imageUrl = `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_REGION}.digitaloceanspaces.com/${imageKey}`;
      const pdfUrl = `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_REGION}.digitaloceanspaces.com/${pdfKey}`;

      // Use sanitizedDate here
      await db.query(
        `INSERT INTO results (publisher_name, publish_date, image_url, pdf_url)
         VALUES (?, ?, ?, ?)`,
        [publisherName, sanitizedDate, imageUrl, pdfUrl]
      );

      fs.unlinkSync(imageFile.path);
      fs.unlinkSync(pdfFile.path);

      res.status(201).json({ success: true, message: "Result published successfully" });
    } catch (error) {
      console.error("CREATE RESULT ERROR:", error);
      res.status(500).json({ success: false });
    }
  },
];

/* ================= READ ALL RESULTS ================= */
export const getAllResults = async (req, res) => {
  try {

    const [rows] = await db.query(
      "SELECT id, publisher_name, DATE_FORMAT(publish_date, '%Y-%m-%d') as publish_date, image_url, pdf_url FROM results ORDER BY publish_date DESC, id DESC"
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("READ ERROR:", error);
    res.status(500).json({ success: false });
  }
};

/* ================= UPDATE METADATA ONLY ================= */
export const updateResultMeta = async (req, res) => {
  try {
    const { id } = req.params;
    const { publisherName, publishDate } = req.body;

    if (!publisherName || !publishDate) {
      return res.status(400).json({ success: false });
    }

    // Sanitize date for update too
    const sanitizedDate = publishDate.split('T')[0];

    await db.query(
      "UPDATE results SET publisher_name=?, publish_date=? WHERE id=?",
      [publisherName, sanitizedDate, id]
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

/* ================= DELETE RESULT ================= */
export const deleteResult = async (req, res) => {
  try {
    const { id } = req.params;

    const [[result]] = await db.query(
      "SELECT image_url, pdf_url FROM results WHERE id=?",
      [id]
    );

    if (!result) {
      return res.status(404).json({ success: false });
    }

    const imageKey = result.image_url.split(".com/")[1];
    const pdfKey = result.pdf_url.split(".com/")[1];

    await s3.send(new DeleteObjectCommand({ Bucket: process.env.DO_SPACES_BUCKET, Key: imageKey }));
    await s3.send(new DeleteObjectCommand({ Bucket: process.env.DO_SPACES_BUCKET, Key: pdfKey }));

    await db.query("DELETE FROM results WHERE id=?", [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};