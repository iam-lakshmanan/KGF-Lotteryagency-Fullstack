import { db } from "../config/db.js";

const Admin = {
  findByUsername: async (username) => {
    const [rows] = await db.execute(
      "SELECT * FROM admins WHERE username = ? LIMIT 1",
      [username]
    );
    return rows[0];
  },

  create: async (username, password) => {
    await db.execute(
      "INSERT INTO admins (username, password) VALUES (?, ?)",
      [username, password]
    );
  }
};

export default Admin;