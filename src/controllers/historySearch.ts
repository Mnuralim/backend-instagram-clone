import { Request, Response, NextFunction } from "express";

import ApiError from "../utils/apiError";
import { IHistory, IUser } from "../../types";
import History from "../models/historySearch";
import User from "../models/user";

export const addHistory = async (req: Request, res: Response, next: NextFunction) => {
  const { targetUser } = req.params;
  try {
    const user: IUser | null = await User.findById(targetUser);
    if (!user) return next(new ApiError("User not found", 404));

    const alreadyAddToHistory: IHistory | null = await History.findOne({
      userId: req.user._id,
      savedUser: targetUser,
    });

    if (!alreadyAddToHistory) {
      await History.create({
        userId: req.user._id,
        savedUser: targetUser,
      });
    } else {
      await History.updateOne(
        {
          userId: req.user._id,
          savedUser: targetUser,
        },
        {
          savedUser: targetUser,
        }
      );
    }

    res.status(201).json({
      success: true,
      message: "Add to history successfully",
    });
  } catch (error: any) {
    next(new ApiError(error.message, 500));
  }
};

export const getAllHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const histories: IHistory[] = await History.find({ userId: req.user._id }).populate("userId", "_id username profile").populate("savedUser", "_id username profile").sort("-updatedAt");
    res.status(201).json({
      success: true,
      data: {
        histories,
      },
    });
  } catch (error: any) {
    next(new ApiError(error.message, 500));
  }
};

export const deleteHistory = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    await History.findByIdAndDelete(id);

    res.status(201).json({
      success: true,
      message: "Delete history successfully",
    });
  } catch (error: any) {
    next(new ApiError(error.message, 500));
  }
};

export const deleteAllHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await History.deleteMany({
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Delete all history successfully",
    });
  } catch (error: any) {
    next(new ApiError(error.message, 500));
  }
};
