import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError";
import User from "../models/user";
import { IPayload, IUser } from "../../types";

const authentication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) return next(new ApiError("No token", 401));

    const token = bearerToken.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as IPayload;

    const user: IUser | null = await User.findById(payload._id);
    req.user = user as IUser;

    next();
  } catch (error: any) {
    next(new ApiError(error.message, 500));
  }
};

export default authentication;
