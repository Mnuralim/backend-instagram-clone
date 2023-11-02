import mongoose, { Types, Document, Schema } from "mongoose";

interface IMessage extends Document {
  message: string;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  type: string;
  messageStatus: string;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    message: String,
    type: {
      type: String,
      default: "text",
    },
    messageStatus: {
      default: "sent",
      type: String,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model<IMessage>("Message", messageSchema);
export default Message;
