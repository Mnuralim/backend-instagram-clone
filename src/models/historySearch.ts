import mongoose, { Schema } from 'mongoose'
import { type IHistory } from '../../types'

const historySchema = new mongoose.Schema<IHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    savedUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
)

const History = mongoose.model<IHistory>('History', historySchema)

export default History
