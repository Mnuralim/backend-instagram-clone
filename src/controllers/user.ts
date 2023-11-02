import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/userModel";
import { uploader } from "../utils/uploaderFile";
import ApiError from "../utils/apiError";

const addUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, username, profileImage, displayName } = req.body;

  try {
    const newUser = await User.create({
      email,
      username,
      profile_image: profileImage,
      display_name: displayName,
    });
    res.status(201).json({
      success: true,
      data: {
        user: newUser,
      },
    });
  } catch (error: any) {
    next(new ApiError(error.message, 500));
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.user as IUser;
    res.status(200).json({
      success: true,
      data: {
        user: user,
      },
    });
  } catch (error: any) {
    next(new ApiError(error.message, 500));
  }
};

const getUserByEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ApiError("user not found", 404));
    }
    res.status(200).json({
      success: true,
      data: {
        user: user,
      },
    });
  } catch (error: any) {
    next(new ApiError(error.message, 500));
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { username, about } = req.body;
  const user = res.locals.user as IUser;
  try {
    const files = req?.files || {};
    //@ts-ignore
    const imagePath = files?.image?.[0].path;

    let urlImage: string = user?.profile_image as string;
    if (imagePath) {
      const date = new Date();
      const imagePublicId = `profileimage${date.getTime()}${user?._id}`;
      const imageResult = await uploader(imagePath as string, imagePublicId);
      urlImage = imageResult.secure_url;
    }

    const updateUserData = await User.findByIdAndUpdate(
      user._id,
      {
        username,
        about,
        profile_image: urlImage,
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      data: {
        user: updateUserData,
      },
    });
  } catch (error: any) {
    next(new ApiError(error.message, 500));
  }
};

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().select("-__v").sort("username");
    res.status(200).json({
      success: true,
      data: {
        users,
      },
    });
  } catch (error: any) {
    next(new ApiError(error.message, 500));
  }
};

export { getAllUsers, updateUser, getUserByEmail, getUserById, addUser };
