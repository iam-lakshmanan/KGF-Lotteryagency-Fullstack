import express from "express";
import {
  uploadVideo,
  getVideos,
  updateVideoDescription,
  deleteVideo,
} from "../controllers/video.controller.js";
import { upload3 } from "../utils/multer.js";

import adminAuth from "../middlewares/adminAuth.js";

const router = express.Router();

router.post(
  "/create",
  adminAuth,
  upload3.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnailimage", maxCount: 1 },
  ]),
  uploadVideo
);
router.get("/read", getVideos);
router.put("/update-description/:id", adminAuth, updateVideoDescription);
router.delete("/delete/:id", adminAuth, deleteVideo);

// router.post(
//   "/create",
//   upload3.fields([
//     { name: "video", maxCount: 1 },
//     { name: "thumbnailimage", maxCount: 1 },
//   ]),
//   uploadVideo
// );
// router.get("/read", getVideos);
// router.put("/update-description/:id", updateVideoDescription);
// router.delete("/delete/:id", deleteVideo);

export default router;