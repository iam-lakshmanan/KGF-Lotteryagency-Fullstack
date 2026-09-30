import express from "express";
import * as controller from "../controllers/image.controller.js";
import adminAuth from "../middlewares/adminAuth.js";
import { upload1 } from "../utils/multer.js";

const router = express.Router();

router.post(
  "/create",
  adminAuth,                 
  upload1.single("image"),    
  controller.uploadImage     
);

router.get("/list", controller.getAllImages);
router.put("/update/:id", adminAuth, controller.updateText);
router.delete("/delete/:id", adminAuth, controller.deleteImage);

// router.post(
//   "/create",               
//   upload1.single("image"),    
//   controller.uploadImage     
// );

// router.get("/list", controller.getAllImages);
// router.put("/update/:id", controller.updateText);
// router.delete("/delete/:id", controller.deleteImage);

export default router;