// models/image.model.js
import { db } from "../config/db.js";

const Image = {
  create(imageUrl, description) {
    return db.query(
      "INSERT INTO images (image_url, description) VALUES (?, ?)",
      [imageUrl, description]
    );
  },

  getAll() {
    return db.query("SELECT * FROM images ORDER BY id DESC");
  },

  updateDescription(id, description) {
    return db.query(
      "UPDATE images SET description=? WHERE id=?",
      [description, id]
    );
  },

  deleteById(id) {
    return db.query("DELETE FROM images WHERE id=?", [id]);
  },

  findById(id) {
    return db
      .query("SELECT * FROM images WHERE id=?", [id])
      .then(([rows]) => rows[0]);
  },
};

export default Image;