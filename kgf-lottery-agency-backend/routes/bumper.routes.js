import express from "express";
import adminAuth from "../middlewares/adminAuth.js";
import {
  createBumper,
  getBumper,
  deleteBumper,
} from "../controllers/bumper.controller.js";
import { upload2 } from "../utils/multer.js";

const router = express.Router();
router.post(
  "/create",
  adminAuth,
  upload2.single("image"),
  createBumper
);

router.get("/read", getBumper);

router.delete("/delete/:id", adminAuth, deleteBumper);

export default router;