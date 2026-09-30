// utils/multer.js
import multer from "multer";
import path from "path";
import fs from "fs";

//-----------Result upload multer-------------//
const uploadDir1 = "uploads/results";
if (!fs.existsSync(uploadDir1)) {
  fs.mkdirSync(uploadDir1, { recursive: true });
}

export const resultUpload = multer({
  storage: multer.diskStorage({
    destination: uploadDir1,
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "image" && file.mimetype.startsWith("image/")) {
      return cb(null, true);
    }
    if (file.fieldname === "pdf" && file.mimetype === "application/pdf") {
      return cb(null, true);
    }
    cb(new Error("Invalid file type"));
  },
});


//---------------image upload multer---------------//
const storage = multer.memoryStorage();
export const upload1 = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});


//---------Video upload multer-----------------//
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed"), false);
  }
};

// export const upload3 = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 500 * 1024 * 1024 }, // 100MB
//   fileFilter: (req, file, cb) => {
//     // 1. Make sure these match what you type in Postman EXACTLY
//     const allowedFields = ["video", "thumbnailimage"]; 

//     if (!allowedFields.includes(file.fieldname)) {
//       return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
//     }

//     if (file.fieldname === "video" && !/mp4|mov|avi|mkv/.test(file.originalname.toLowerCase())) {
//       return cb(new Error("Invalid video file type"));
//     }

//     // 2. This now matches the allowedFields list above
//     if (file.fieldname === "thumbnailimage" && !/jpeg|jpg|png/.test(file.originalname.toLowerCase())) {
//       return cb(new Error("Invalid thumbnail file type"));
//     }

//     cb(null, true);
//   },
// });

const uploadDir2 = 'uploads/';
if (!fs.existsSync(uploadDir2)) {
    fs.mkdirSync(uploadDir);
}

export const upload3 = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir2),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
  fileFilter: (req, file, cb) => {
    const allowedFields = ["video", "thumbnailimage"];
    
    if (!allowedFields.includes(file.fieldname)) {
      return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
    }

    if (file.fieldname === "video") {
      const isVideo = /\.(mp4|mov|avi|mkv)$/i.test(file.originalname);
      if (!isVideo) return cb(new Error("Invalid video file type"));
    }

    if (file.fieldname === "thumbnailimage") {
      const isImage = /\.(jpeg|jpg|png)$/i.test(file.originalname);
      if (!isImage) return cb(new Error("Invalid thumbnail file type"));
    }

    cb(null, true);
  },
});


//-------------Bumper image upload multer
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

export const upload2 = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (_, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});