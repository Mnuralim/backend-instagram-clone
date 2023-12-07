import mongoose, { Schema } from "mongoose";
import { IPost } from "../../types";

const postSchema = new mongoose.Schema<IPost>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    media: {
      type: String,
      required: true,
    },
    likedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    totalLike: {
      type: Number,
      default: 0,
    },
    totalComment: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      enum: ["post", "reel"],
      default: "post",
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
