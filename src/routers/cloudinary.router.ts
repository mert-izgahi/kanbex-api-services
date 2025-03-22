import {Router} from "express";
import { uploadImage,uploadDocument,uploadVideo } from "../controllers/cloudinary.controller";
import { withAuth } from "../middlewares/auth.middleware";
import { tryCatch } from "../middlewares/try-catch.middleware";
import { pdfUploader,imageUploader,videoUploader } from "../controllers/cloudinary.controller";
const router = Router();

router.post("/upload-image", withAuth,imageUploader.single("image"), tryCatch(uploadImage));
router.post("/upload-document", withAuth,pdfUploader.single("document"), tryCatch(uploadDocument));
router.post("/upload-video", withAuth,videoUploader.single("video"), tryCatch(uploadVideo));

export { router as cloudinaryRouter };