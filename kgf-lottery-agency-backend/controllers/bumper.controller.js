import fs from "fs";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/spaces.js";
import { db } from "../config/db.js";

/* ================= CREATE ================= */
export const createBumper = [


  async (req, res) => {
    try {
      const {
        seasonTitle,
        marqueeText,
        singlePrice,
        seriesPrice,
        drawDate,
        firstPrize,
      } = req.body;

      if (
        !seasonTitle ||
        !marqueeText ||
        !singlePrice ||
        !seriesPrice ||
        !drawDate ||
        !firstPrize ||
        !req.file
      ) {
        return res.status(400).json({ success: false, message: "All fields required" });
      }

      /* Remove existing bumper */
      const [[old]] = await db.query("SELECT poster_image_url FROM bumper_offers LIMIT 1");
      if (old) {
        const oldKey = old.poster_image_url.split(".com/")[1];
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.DO_SPACES_BUCKET,
            Key: oldKey,
          })
        );
        await db.query("DELETE FROM bumper_offers");
      }

      /* Upload new image */
      const imageKey = `Website/bumperoffer-images/${Date.now()}-${req.file.originalname}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.DO_SPACES_BUCKET,
          Key: imageKey,
          Body: fs.createReadStream(req.file.path),
          ACL: "public-read",
          ContentType: req.file.mimetype,
        })
      );

      const imageUrl = `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_REGION}.digitaloceanspaces.com/${imageKey}`;

      await db.query(
        `INSERT INTO bumper_offers
        (season_title, marquee_text, poster_image_url, single_price, series_price, draw_date, first_prize)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          seasonTitle,
          marqueeText,
          imageUrl,
          singlePrice,
          seriesPrice,
          drawDate,
          firstPrize,
        ]
      );

      fs.unlinkSync(req.file.path);

      res.status(201).json({ success: true, message: "Bumper published" });
    } catch (err) {
      console.error("CREATE BUMPER ERROR:", err);
      res.status(500).json({ success: false });
    }
  },
];

/* ================= READ ACTIVE BUMPER ================= */
export const getBumper = async (req, res) => {
  const [[row]] = await db.query(
    "SELECT * FROM bumper_offers ORDER BY created_at DESC LIMIT 1"
  );
  res.json({ success: true, data: row || null });
};

/* ================= DELETE BUMPER ================= */
export const deleteBumper = async (req, res) => {
  const [[row]] = await db.query(
    "SELECT poster_image_url FROM bumper_offers LIMIT 1"
  );

  if (!row) return res.status(404).json({ success: false });

  const key = row.poster_image_url.split(".com/")[1];

  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: key,
    })
  );

  await db.query("DELETE FROM bumper_offers");

  res.json({ success: true });
};