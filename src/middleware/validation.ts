import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import ApiError from "../utils/apiError";
import { IHistory, IPost, IUser } from "../../types";
import Post from "../models/post";
import History from "../models/historySearch";

const validationId = (model: string) => {
  if (model === "user") {
    return async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const user: IUser | null = await User.findById(id);
      if (!user) return next(new ApiError("User not found", 404));
      next();
    };
  } else if (model === "post") {
    return async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const post: IPost | null = await Post.findById(id);
      if (!post) return next(new ApiError("Post not found", 404));
      next();
    };
  } else {
    return async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const history: IHistory | null = await History.findById(id);
      if (!history) return next(new ApiError("History not found", 404));
      next();
    };
  }
};

export default validationId;
