import mongoose, { Schema } from "mongoose";
import { IUser } from "../../types";

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
    },
    password: {
      type: String,
    },
    profile: {
      fullName: {
        type: String,
      },
      birth: Date,
      address: String,
      gender: String,
      imageProfile: {
        type: String,
        default: "https://www.pngfind.com/pngs/m/676-6764065_default-profile-picture-transparent-hd-png-download.png",
      },
      bio: {
        type: String,
        default: "",
      },
      link: {
        type: String,
        default: "",
      },
    },
    follower: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    totalFollower: {
      type: Number,
      default: 0,
    },

    totalFollowing: {
      type: Number,
      default: 0,
    },
    totalPost: {
      type: Number,
      default: 0,
    },
    refreshToken: {
      type: String || null,
      default: null,
    },
    passwordResetExp: {
      type: Date,
    },
    passwordResetToken: {
      type: String || null,
      default: null,
    },
    passwordUpdatedAt: Date,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
