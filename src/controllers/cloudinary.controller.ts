import { Request, Response } from "express";
import cloudinary from "../lib/cloudinary";
import { sendResponse } from "../helpers/utils";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { ApiError } from "../lib/api-error";

const staticFilesPath = path.resolve(__dirname, "../../public/uploads");

const pdfStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, staticFilesPath, "documents"));
  },
  filename: function (req, file, cb) {
    const hexName = crypto.randomBytes(16).toString("hex");

    const fileExtension = path.extname(file.originalname);

    const fileName = `${hexName}${fileExtension}`;

    cb(null, fileName);
  },
});

export const pdfUploader = multer({
  storage: pdfStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter(req, file, callback) {
    if (file.mimetype === "application/pdf") {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
});

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, staticFilesPath, "images"));
  },
  filename: function (req, file, cb) {
    const hexName = crypto.randomBytes(16).toString("hex");

    const fileExtension = path.extname(file.originalname);

    const fileName = `${hexName}${fileExtension}`;

    cb(null, fileName);
  },
});

export const imageUploader = multer({
  storage: imageStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter(req, file, callback) {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
});

const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, staticFilesPath, "videos"));
  },
  filename: function (req, file, cb) {
    const hexName = crypto.randomBytes(16).toString("hex");

    const fileExtension = path.extname(file.originalname);

    const fileName = `${hexName}${fileExtension}`;

    cb(null, fileName);
  },
});

export const videoUploader = multer({
  storage: videoStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter(req, file, callback) {
    if (file.mimetype === "video/mp4") {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
});

export const uploadImage = async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ error: "No image file found" });
    return;
  }
  const result = await cloudinary.uploader.upload(file.path);
  fs.unlinkSync(file.path);
  sendResponse(res, result);
};

export const uploadVideo = async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ error: "No video file found" });
    return;
  }
  const result = await cloudinary.uploader.upload(file.path, {
    resource_type: "video",
    format: "mp4",
    chunk_size: 6000000, // 6MB
  });
  fs.unlinkSync(file.path);
  sendResponse(res, result);
};

export const uploadDocument = async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ error: "No document file found" });
    return;
  }
  const result = await cloudinary.uploader.upload(file.path, {
    resource_type: "auto",
    format: "pdf",
    chunk_size: 6000000, // 6MB
  });
  
  fs.unlinkSync(file.path);
  sendResponse(res, result);
};
