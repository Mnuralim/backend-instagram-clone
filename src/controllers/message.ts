import { NextFunction, Request, Response } from "express";
import Message from "../models/messageModel";
import pusher from "../utils/pusher";
import { uploader } from "../utils/uploaderFile";
import ApiError from "../utils/apiError";

const addNewMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { from, to }: { from?: string; to?: string } = req.params;
    const { message }: { message: string } = req.body;

    const files = req?.files || {};
    //@ts-ignore
    const imagePath = files.image?.[0]?.path;
    //@ts-ignore
    const audioPath = files.audio?.[0]?.path;

    const date = new Date();
    const imagePublicId = `IMG-message${date.getTime()}${from}`;
    const audioPublicId = `AUDIO-message${date.getTime()}${from}`;

    let messageData: string = message;
    let messageType: string = "text";

    if (imagePath) {
      const imageResult = await uploader(imagePath as string, imagePublicId);
      messageType = "image";
      messageData = imageResult.secure_url;
    } else if (audioPath) {
      const audioResult = await uploader(audioPath as string, audioPublicId);
      messageType = "audio";
      messageData = audioResult.secure_url;
    }

    const newMessage = await Message.create({
      message: messageData,
      sender: from,
      receiver: to,
      messageStatus: "delivered",
      type: messageType,
    });

    await newMessage.populate("sender receiver", "_id username profile_image");

    await pusher.trigger("messages", "new-message", {
      message: newMessage,
      from: from,
      to: to,
    });

    res.status(201).json({
      success: true,
      data: {
        message: newMessage,
      },
    });
  } catch (error: any) {
    next(new ApiError(error.message, 500));
  }
};

const getAllMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { from, to }: { from?: string; to?: string } = req.params;
    const messages = await Message.find({
      $or: [
        {
          sender: from,
          receiver: to,
        },
        {
          sender: to,
          receiver: from,
        },
      ],
    })
      .populate("sender receiver", "_id username profile_image")
      .select("-__v -updatedAt");

    const unreadMessages = messages.filter((message) => message.messageStatus !== "read" && message.sender.id.toString() === to.toString()).map((message) => message.id);

    await Message.updateMany(
      {
        _id: {
          $in: unreadMessages,
        },
      },
      {
        $set: {
          messageStatus: "read",
        },
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      data: {
        messages,
      },
    });
  } catch (error: any) {
    next(new ApiError(error.message, 500));
  }
};

const getAllConversation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userid }: { userid?: string } = req.params;

    const conversations = await Message.find({
      $or: [
        {
          sender: userid,
        },
        {
          receiver: userid,
        },
      ],
    })
      .populate("sender receiver", "_id username profile_image")
      .select("-__v -updatedAt");

    const allConversations = [...conversations].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const converationList = new Map<string, any>();

    const messageStatusChange: string[] = [];

    allConversations.forEach((conv) => {
      const isSender: boolean = conv.sender._id.toString() === userid;
      const calculateId = isSender ? conv.receiver.id.toString() : conv.sender.id.toString();

      if (conv.messageStatus === "sent") {
        messageStatusChange.push(conv.id);
      }

      const { id, message, messageStatus, type, createdAt } = conv;
      const senderId = conv.sender.id;
      const receiverId = conv.receiver.id;
      const receiver = conv.receiver;
      const sender = conv.sender;

      if (!converationList.get(calculateId)) {
        let user = {
          _id: id,
          type,
          message,
          messageStatus,
          createdAt,
          senderId,
          receiverId,
          receiver,
          sender,
          totalUnreadMessage: 0,
        };
        if (senderId) {
          user = {
            ...user,
            ...conv.receiver,
            totalUnreadMessage: 0,
          };
        } else {
          user = {
            ...user,
            ...conv.sender,
            totalUnreadMessage: messageStatus !== "read" ? 1 : 0,
          };
        }
        converationList.set(calculateId, { ...user });
      } else if (conv.messageStatus !== "read" && !isSender) {
        const user = converationList.get(calculateId);
        converationList.set(calculateId, {
          ...user,
          totalUnreadMessage: user.totalUnreadMessage + 1,
        });
      }
    });

    if (messageStatusChange.length) {
      await Message.updateMany(
        {
          _id: {
            $in: messageStatusChange,
          },
        },
        {
          $set: {
            messageStatus: "delivered",
          },
        }
      );
    }

    res.status(200).json({
      success: true,
      data: {
        conversations: Array.from(converationList.values()),
      },
    });
  } catch (error: any) {
    next(new ApiError(error.message, 500));
  }
};

const deleteMessages = async (req: Request, res: Response, next: NextFunction) => {
  const { from, to }: { from?: string; to?: string } = req.params;
  try {
    await Message.deleteMany({
      $or: [
        {
          sender: from,
          receiver: to,
        },
        {
          sender: to,
          receiver: from,
        },
      ],
    });

    res.status(200).json({
      success: true,
      messages: "Success deleted data",
    });
  } catch (error: any) {
    next(new ApiError(error.message, 500));
  }
};

export { addNewMessage, getAllMessages, getAllConversation, deleteMessages };
