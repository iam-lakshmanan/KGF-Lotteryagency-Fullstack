// routes/result.routes.js
import express from "express";
import adminAuth from "../middlewares/adminAuth.js";
import {
  createResult,
  getAllResults,
  updateResultMeta,
  deleteResult,
} from "../controllers/result.controller.js";
import { resultUpload } from "../utils/multer.js";


const router = express.Router();

router.post(
  "/create",
  adminAuth,
  resultUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  createResult
);
router.get("/read", getAllResults);
router.put("/update/:id", adminAuth, updateResultMeta);
router.delete("/delete/:id", adminAuth, deleteResult);

// router.post(
//   "/create",
//   resultUpload.fields([
//     { name: "image", maxCount: 1 },
//     { name: "pdf", maxCount: 1 },
//   ]),
//   createResult
// );
// router.get("/read", getAllResults);
// router.put("/update/:id",  updateResultMeta);
// router.delete("/delete/:id", deleteResult);

export default router;