import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/apiError";
import imagekit from "../utils/imagekit";
import { CreatePostBody, IPost, IUser } from "../../types";
import Post from "../models/post";
import User from "../models/user";

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  const { caption, type }: CreatePostBody = req.body;

  try {
    const file = req.file;
    if (!file) return next(new ApiError("File not found", 400));

    const split = file.originalname.split(".");
    const ext = split[split.length - 1];

    const uploadedFile = await imagekit.upload({
      file: file.buffer,
      fileName: `${type === "post" ? "POST" : "REEL"}-${Date.now()}.${ext}`,
      folder: "instagram-clone/post",
    });

    await Post.create({
      userId: req.user._id,
      caption,
      type,
      media: uploadedFile.url,
    });

    const user: IUser = (await User.findById(req.user._id).select("totalPost")) as IUser;
    const totalPost = user.totalPost;
    user.totalPost = totalPost + 1;
    await user.save();

    res.status(201).json({
      success: true,
      message: "Create new post successfully",
    });
  } catch (error: any) {
    next(new ApiError(error.message, 500));
  }
};

export const getAllPost = async (req: Request, res: Response, next: NextFunction) => {
  const { author, limit } = req.query;
  try {
    const filterPost = {} as { userId: string };
    if (author) {
      filterPost.userId = author as string;
    }
    const posts = await Post.find(filterPost)
      .populate("likedBy", "profile _id username createdAt")
      .populate("userId", "profile _id username")
      .sort({ createdAt: -1 })
      .select("-__v")
      .limit(parseInt(limit as string));

    const allPosts = posts.map((post) => {
      const alreadyLike = post.likedBy.find((el) => el._id.toString() === req.user._id?.toString());
      return { ...post.toObject(), alreadyLike: alreadyLike ? true : false };
    });
    res.status(200).json({
      success: true,
      data: {
        posts: allPosts,
      },
    });
  } catch (error: any) {
    next(new ApiError(error.message, 500));
  }
};

export const getPostById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const post = (await Post.findById(id)
      .populate("likedBy")
      .populate("userId", "-__v -password -refreshToken -passwordResetExp -passwordResetToken")) as IPost;

    const alreadyLike = post.likedBy.find((el) => el._id.toString() === req.user._id?.toString());
    const singlePost = { ...post.toObject(), alreadyLike: alreadyLike ? true : false };

    res.status(200).json({
      success: true,
      data: {
        post: singlePost,
      },
    });
  } catch (error: any) {
    next(new ApiError(error.message, 500));
  }
};

export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const post = (await Post.findById(id)) as IPost;
    if (post.userId.toString() !== req.user._id?.toString()) return next(new ApiError("You are not allowed", 401));

    await Post.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Delete post successfully",
    });
  } catch (error: any) {
    next(new ApiError(error.message, 500));
  }
};

export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { caption } = req.body;

  try {
    await Post.findByIdAndUpdate(
      id,
      {
        caption: caption,
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      message: "Update post successfully",
    });
  } catch (error: any) {
    next(new ApiError(error.message, 500));
  }
};

export const likePost = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const post = (await Post.findById(id)) as IPost;
    const likedBy = post.likedBy;
    const totalLike = post.totalLike;

    const isLiked = likedBy.find((data) => data.toString() === req.user._id?.toString());

    let message: string = "";
    if (!isLiked) {
      post.likedBy.push(req.user._id);
      post.totalLike = totalLike + 1;
      await post.save();
      message = "You already like this post";
    } else {
      // @ts-ignore
      post.likedBy.pull(req.user._id);
      post.totalLike = totalLike - 1;
      await post.save();
      message = "You already dislike this post";
    }

    res.status(200).json({
      success: true,
      message,
    });
  } catch (error: any) {
    next(new ApiError(error.message, 500));
  }
};

export const getAllLikes = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const post = (await Post.findById(id).populate("likedBy", "profile username follower")) as IPost;
    const likes = post.likedBy;

    const allLikes = likes.map((like) => {
      // @ts-ignore
      const alreadyFollow = like.follower.find((el) => el._id.toString() === req.user._id?.toString());
      return { ...like.toObject(), alreadyFollow: alreadyFollow ? true : false };
    });

    res.status(200).json({
      success: true,
      allLikes,
    });
  } catch (error: any) {
    next(new ApiError(error.message, 500));
  }
};
