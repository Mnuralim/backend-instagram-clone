import mongoose, { Schema } from 'mongoose'
import { type IUser } from '../../types'

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    mobile: {
      type: String
    },
    password: {
      type: String
    },
    profile: {
      fullName: {
        type: String,
        default: ''
      },
      birth: Date,
      address: String,
      gender: String,
      imageProfile: {
        type: String,
        default: 'https://ik.imagekit.io/ku9epk6lrv/user%20(1).png?updatedAt=1701280630365'
      },
      bio: {
        type: String,
        default: ''
      },
      link: {
        type: String,
        default: ''
      }
    },
    follower: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    totalFollower: {
      type: Number,
      default: 0
    },

    totalFollowing: {
      type: Number,
      default: 0
    },
    totalPost: {
      type: Number,
      default: 0
    },
    refreshToken: {
      type: String || null,
      default: null
    },
    passwordResetExp: {
      type: Date
    },
    passwordResetToken: {
      type: String || null,
      default: null
    },
    passwordUpdatedAt: Date
  },
  {
    timestamps: true
  }
)

const User = mongoose.model<IUser>('User', userSchema)

export default User
