import type { Request, Response, NextFunction } from "express";
import { AppError } from "./AppError";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      msg: err.message,
    });
  }

  //logger error

  //
  return res.status(500).json({
    success: false,
    msg: "Internal Server error",
  });
}
