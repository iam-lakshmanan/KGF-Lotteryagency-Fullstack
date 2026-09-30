// models/video.model.js
import { db } from "../config/db.js";

const Video = {
  create(videoUrl, thumbnailUrl, description) {
    return db.query(
      `INSERT INTO videos (video_url, thumbnail_url, description)
       VALUES (?, ?, ?)`,
      [videoUrl, thumbnailUrl, description]
    );
  },

  getAll() {
    return db.query("SELECT * FROM videos ORDER BY id DESC");
  },

  updateDescription(id, description) {
    return db.query(
      "UPDATE videos SET description=? WHERE id=?",
      [description, id]
    );
  },

  deleteById(id) {
    return db.query("DELETE FROM videos WHERE id=?", [id]);
  },

  findById(id) {
    return db
      .query("SELECT * FROM videos WHERE id=?", [id])
      .then(([rows]) => rows[0]);
  },
};

export default Video;