"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const message_1 = require("../controllers/message");
const uploadFile_1 = require("../middleware/uploadFile");
const validation_1 = require("../middleware/validation");
const messageRouter = express_1.default.Router();
messageRouter.post("/:from/:to", validation_1.checkSenderAndReceiver, uploadFile_1.upload, message_1.addNewMessage);
messageRouter.get("/conversations/:userid", validation_1.userExists, message_1.getAllConversation);
messageRouter.get("/:from/:to", validation_1.checkSenderAndReceiver, message_1.getAllMessages);
messageRouter.delete("/:from/:to", validation_1.checkSenderAndReceiver, message_1.deleteMessages);
exports.default = messageRouter;
