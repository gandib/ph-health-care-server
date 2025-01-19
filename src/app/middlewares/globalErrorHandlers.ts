import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error.code === "P2002") {
    const target = error.meta.target[0];
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: `${
        target[0].toUpperCase() + target.substring(1)
      } is already exists!`,
      error,
    });
    return;
  }

  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: error?.message || "Something went wrong!",
    error,
  });
};

export default globalErrorHandler;
