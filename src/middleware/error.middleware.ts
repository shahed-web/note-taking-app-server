import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error";
import { ZodError } from "zod";
import { Error as MongooseError } from "mongoose";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.issues,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err.code === "11000") {
    return res.status(400).json({
      success: false,
      message: "Duplicate field value",
    });
  }

  if (err instanceof MongooseError.CastError) {
  return res.status(400).json({
    success: false,
    message: "Invalid resource ID",
  });
}

  console.error("UNEXPECTED ERROR:", err);

  return res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
};