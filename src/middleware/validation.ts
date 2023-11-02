import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import ApiError from "../utils/apiError";

const checkBody = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.message) {
    return res.status(400).json({
      message: "Message field are required",
    });
  }
  next();
};

const userExists = async (req: Request, res: Response, next: NextFunction) => {
  const { userid } = req.params;
  try {
    const user = await User.findById(userid).select("-__v");
    if (!user) {
      return next(new ApiError("User not found", 404));
    }
    res.locals.user = user;
    next();
  } catch (error: any) {
    next(new ApiError(error.message, 500));
  }
};

const checkSenderAndReceiver = async (req: Request, res: Response, next: NextFunction) => {
  const { from, to } = req.params;
  try {
    const sender = await User.findById(from);
    const receiver = await User.findById(to);
    if (!sender || !receiver) {
      return next(new ApiError("sender or receiver not found", 400));
    }
    next();
  } catch (error: any) {
    next(new ApiError(error.message, 500));
  }
};

export { checkBody, userExists, checkSenderAndReceiver };
