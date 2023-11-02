import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError";

const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status;
  err.message = err.message;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

export default errorHandler;
