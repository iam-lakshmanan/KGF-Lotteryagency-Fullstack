import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import imageRoutes from "./routes/image.routes.js";
import videoRoutes from "./routes/video.routes.js";
import resultRoutes from "./routes/result.routes.js"; 
import bumperRoutes from "./routes/bumper.routes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://kgflottery.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/images", imageRoutes);

app.use(express.urlencoded({ extended: false }));


app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/results", resultRoutes); 
app.use("/api/bumper", bumperRoutes);


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server Successfully running on port ${PORT}`);
});