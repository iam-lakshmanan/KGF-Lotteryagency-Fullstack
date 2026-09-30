import express from "express";

const router = express.Router();

import adminKey from "../middlewares/secretKey.middleware.js";
import { login, createAdmin } from "../controllers/authController.js";

router.post("/login", adminKey, login);
router.post("/create-admin", createAdmin);

export default router;