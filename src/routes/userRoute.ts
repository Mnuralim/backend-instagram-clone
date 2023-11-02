import express, { Router } from "express";
import { addUser, getAllUsers, getUserByEmail, getUserById, updateUser } from "../controllers/user";
import { upload } from "../middleware/uploadFile";
import { userExists } from "../middleware/validation";

const userRouter: Router = express.Router();

userRouter.post("/", addUser);
userRouter.get("/", getAllUsers);
userRouter.get("/check-user/:email", getUserByEmail);
userRouter.get("/:userid", userExists, getUserById);
userRouter.patch("/:userid", userExists, upload, updateUser);

export default userRouter;
