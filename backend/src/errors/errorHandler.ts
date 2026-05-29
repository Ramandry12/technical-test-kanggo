import { Request, Response, NextFunction } from "express";
import { ApiError } from "./apiError";
import logger from "../config/logger";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof ApiError) {
    if (err.statusCode < 500) {
      logger.warn(
        `Operational Error [${err.statusCode}]: ${err.message} %o`,
        err.errors || "",
      );
    } else {
      logger.error(
        `Operational Server Error [${err.statusCode}]: ${err.message}`,
        err,
      );
    }

    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
    });
    return;
  }

  logger.error("Unhandled Application Error: %o", err);

  res.status(500).json({
    success: false,
    message: "Terjadi kesalahan internal server.",
  });
};

export default errorHandler;
