import mongoose from "mongoose";
import { logger } from "./logger";

export const connectDatabase = async (connectionString: string) => {
  try {
    await mongoose.connect(connectionString);
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error("Error connecting to MongoDB", error);
  }
};
