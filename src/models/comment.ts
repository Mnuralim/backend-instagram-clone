import mongoose, { Schema } from 'mongoose'
import { type IComment } from '../../types'

const commentSchema = new mongoose.Schema<IComment>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true
    },
    text: {
      type: String,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    replies:
      [
        {
          text: String,
          user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
          }
        }
      ] || []
  },
  {
    timestamps: true
  }
)

const Comment = mongoose.model<IComment>('Comment', commentSchema)

export default Comment
