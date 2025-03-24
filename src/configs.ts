import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export default {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN,
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: process.env.MAIL_PORT,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,
  MAIL_FROM: process.env.MAIL_FROM,
  MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN,
  MAILGUN_API_KEY:process.env.MAILGUN_API_KEY,
  CLIENT_URL: process.env.CLIENT_URL,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  TASK_POSITION_INCREMENT: process.env.TASK_POSITION_INCREMENT
};
const ALLOWED_ORIGINS = [
  "https://kanbex-client-app.onrender.com",
  "http://localhost:3000",
  "http://localhost:5001",
];
export const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (ALLOWED_ORIGINS.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
