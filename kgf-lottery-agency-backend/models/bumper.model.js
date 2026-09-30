// models/bumper.model.js
import { db } from "../config/db.js";

const Bumper = {
  create(data) {
    const {
      seasonTitle,
      marqueeText,
      posterUrl,
      singlePrice,
      seriesPrice,
      drawDate,
      firstPrize,
    } = data;

    return db.query(
      `INSERT INTO bumper_offers
       (season_title, marquee_text, poster_url,
        single_price, series_price, draw_date, first_prize)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        seasonTitle,
        marqueeText,
        posterUrl,
        singlePrice,
        seriesPrice,
        drawDate,
        firstPrize,
      ]
    );
  },

  getLatest() {
    return db.query(
      "SELECT * FROM bumper_offers ORDER BY id DESC LIMIT 1"
    );
  },

  deleteById(id) {
    return db.query("DELETE FROM bumper_offers WHERE id=?", [id]);
  },
};

export default Bumper;