import { createLogger, transports, format } from "winston";

export const logger = createLogger({
    transports: [
      new transports.File({
        dirname: `${__dirname}`,
        filename: "app.log",
      }),
    ],
    format: format.combine(
      format.timestamp(),
      format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level}: ${message}`;
      })
    ),
  });