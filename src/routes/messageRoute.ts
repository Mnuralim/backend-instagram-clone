import express, { Router } from "express";
import { addNewMessage, deleteMessages, getAllConversation, getAllMessages } from "../controllers/message";
import { upload } from "../middleware/uploadFile";
import { checkSenderAndReceiver, userExists } from "../middleware/validation";

const messageRouter: Router = express.Router();

messageRouter.post("/:from/:to", checkSenderAndReceiver, upload, addNewMessage);
messageRouter.get("/conversations/:userid", userExists, getAllConversation);
messageRouter.get("/:from/:to", checkSenderAndReceiver, getAllMessages);
messageRouter.delete("/:from/:to", checkSenderAndReceiver, deleteMessages);

export default messageRouter;
