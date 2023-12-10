import { type Document } from 'mongoose'

interface RegisterBody {
  username: string
  password: string
  email: string
}

interface IPayload {
  _id?: string
  username?: string
  email?: string
}

declare global {
  namespace Express {
    interface Request {
      user: IPayload
    }
  }
}

interface IPost extends Document {
  userId: Schema.Types.ObjectId
  caption: string
  media: string
  likedBy: [Schema.Types.ObjectId]
  totalLike: number
  totalComment: number
  type: string
}

interface IUser extends Document {
  username: string
  email: string
  password: string
  mobile: string
  profile: {
    fullName: string
    birth: Date
    address: string
    gender: string
    imageProfile: string
    bio: string
    link: string
  }
  follower: [Schema.Types.ObjectId]
  following: [Schema.Types.ObjectId]
  totalFollower: number
  totalFollowing: number
  totalPost: number
  refreshToken: string
  passwordResetToken: string
  passwordResetExp: Date
  passwordUpdatedAt: Date
}

interface IHistory extends Document {
  userId: Schema.Types.ObjectId
  savedUser: Schema.Types.ObjectId
}

interface CreatePostBody {
  caption: string
  type: string
}

interface IComment extends Document {
  post: Schema.Types.ObjectId
  text: string
  user: Schema.Types.ObjectId
  replies:
  | [
    {
      text: string
      user: Schema.Types.ObjectId
    }
  ]
  // eslint-disable-next-line @typescript-eslint/ban-types
  | [{}]
}
