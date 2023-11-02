"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const uploadFile_1 = require("../middleware/uploadFile");
const validation_1 = require("../middleware/validation");
const userRouter = express_1.default.Router();
userRouter.post("/", user_1.addUser);
userRouter.get("/", user_1.getAllUsers);
userRouter.get("/check-user/:email", user_1.getUserByEmail);
userRouter.get("/:userid", validation_1.userExists, user_1.getUserById);
userRouter.patch("/:userid", validation_1.userExists, uploadFile_1.upload, user_1.updateUser);
exports.default = userRouter;
