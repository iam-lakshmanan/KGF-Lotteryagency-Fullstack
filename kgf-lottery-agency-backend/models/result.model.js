// models/result.model.js
import { db } from "../config/db.js";

const Result = {
  create(publisherName, publishDate, imageUrl, pdfUrl) {
    return db.query(
      `INSERT INTO results
       (publisher_name, publish_date, image_url, pdf_url)
       VALUES (?, ?, ?, ?)`,
      [publisherName, publishDate, imageUrl, pdfUrl]
    );
  },

  getAll() {
    return db.query(
      "SELECT * FROM results ORDER BY publish_date DESC"
    );
  },

  updateMeta(id, publisherName, publishDate) {
    return db.query(
      `UPDATE results
       SET publisher_name=?, publish_date=?
       WHERE id=?`,
      [publisherName, publishDate, id]
    );
  },

  deleteById(id) {
    return db.query("DELETE FROM results WHERE id=?", [id]);
  },

  findById(id) {
    return db
      .query("SELECT * FROM results WHERE id=?", [id])
      .then(([rows]) => rows[0]);
  },
};

export default Result;