import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const { method, originalUrl } = req;
    const { statusCode } = res;

    let statusIndicator = "ℹ️";
    if (statusCode >= 500) {
      statusIndicator = "❌";
    } else if (statusCode >= 400) {
      statusIndicator = "⚠️";
    } else if (statusCode >= 300) {
      statusIndicator = "🔄";
    } else if (statusCode >= 200) {
      statusIndicator = "✅";
    }

    const logMessage = `${statusIndicator} ${method} ${originalUrl} - Status: ${statusCode} - ${duration}ms`;

    if (statusCode >= 500) {
      logger.error(logMessage);
    } else if (statusCode >= 400) {
      logger.warn(logMessage);
    } else {
      logger.http(logMessage);
    }
  });

  next();
};
