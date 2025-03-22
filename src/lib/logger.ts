import pino from "pino";
import dayjs from "dayjs";
import fs from "fs";
import path from "path";


const logDirectory = path.join(path.resolve(__dirname, "../../"), "logs");

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}
// Log file path
const logFilePath = path.join(logDirectory, `app.log-${dayjs().format("YYYY-MM-DD")}.log`);

const loggerInstance = pino({
  transport: {
    targets: [
      {
        target: "pino/file",
        options: { destination: logFilePath, mkdir: true },
      },
      {
        target: "pino-pretty", // Pretty print logs in console
        options: {
          colorize: true,
          translateTime: true,
          ignore: "pid,hostname",
        },
      },
    ],
    options: {
      colorize: true,
      translateTime: true,
      ignore: "pid,hostname",
    },
  },
  base: {
    pid: false,
  },
  // level: process.env.NODE_ENV === "production" ? "info" : "debug",
  timestamp: () => `,"time":"${dayjs().format("YYYY-MM-DD HH:mm:ss")}"`,
});

export { loggerInstance as logger };