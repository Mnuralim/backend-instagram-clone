"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessages = exports.getAllConversation = exports.getAllMessages = exports.addNewMessage = void 0;
const messageModel_1 = __importDefault(require("../models/messageModel"));
const pusher_1 = __importDefault(require("../utils/pusher"));
const uploaderFile_1 = require("../utils/uploaderFile");
const apiError_1 = __importDefault(require("../utils/apiError"));
const addNewMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { from, to } = req.params;
        const { message } = req.body;
        const files = (req === null || req === void 0 ? void 0 : req.files) || {};
        //@ts-ignore
        const imagePath = (_b = (_a = files.image) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.path;
        //@ts-ignore
        const audioPath = (_d = (_c = files.audio) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.path;
        const date = new Date();
        const imagePublicId = `IMG-message${date.getTime()}${from}`;
        const audioPublicId = `AUDIO-message${date.getTime()}${from}`;
        let messageData = message;
        let messageType = "text";
        if (imagePath) {
            const imageResult = yield (0, uploaderFile_1.uploader)(imagePath, imagePublicId);
            messageType = "image";
            messageData = imageResult.secure_url;
        }
        else if (audioPath) {
            const audioResult = yield (0, uploaderFile_1.uploader)(audioPath, audioPublicId);
            messageType = "audio";
            messageData = audioResult.secure_url;
        }
        const newMessage = yield messageModel_1.default.create({
            message: messageData,
            sender: from,
            receiver: to,
            messageStatus: "delivered",
            type: messageType,
        });
        yield newMessage.populate("sender receiver", "_id username profile_image");
        yield pusher_1.default.trigger("messages", "new-message", {
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
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
});
exports.addNewMessage = addNewMessage;
const getAllMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { from, to } = req.params;
        const messages = yield messageModel_1.default.find({
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
        yield messageModel_1.default.updateMany({
            _id: {
                $in: unreadMessages,
            },
        }, {
            $set: {
                messageStatus: "read",
            },
        }, {
            new: true,
        });
        res.status(200).json({
            success: true,
            data: {
                messages,
            },
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
});
exports.getAllMessages = getAllMessages;
const getAllConversation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userid } = req.params;
        const conversations = yield messageModel_1.default.find({
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
        const converationList = new Map();
        const messageStatusChange = [];
        allConversations.forEach((conv) => {
            const isSender = conv.sender._id.toString() === userid;
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
                    user = Object.assign(Object.assign(Object.assign({}, user), conv.receiver), { totalUnreadMessage: 0 });
                }
                else {
                    user = Object.assign(Object.assign(Object.assign({}, user), conv.sender), { totalUnreadMessage: messageStatus !== "read" ? 1 : 0 });
                }
                converationList.set(calculateId, Object.assign({}, user));
            }
            else if (conv.messageStatus !== "read" && !isSender) {
                const user = converationList.get(calculateId);
                converationList.set(calculateId, Object.assign(Object.assign({}, user), { totalUnreadMessage: user.totalUnreadMessage + 1 }));
            }
        });
        if (messageStatusChange.length) {
            yield messageModel_1.default.updateMany({
                _id: {
                    $in: messageStatusChange,
                },
            }, {
                $set: {
                    messageStatus: "delivered",
                },
            });
        }
        res.status(200).json({
            success: true,
            data: {
                conversations: Array.from(converationList.values()),
            },
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
});
exports.getAllConversation = getAllConversation;
const deleteMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, to } = req.params;
    try {
        yield messageModel_1.default.deleteMany({
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
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
});
exports.deleteMessages = deleteMessages;
