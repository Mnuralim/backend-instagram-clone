import express from "express";
import authentication from "../middleware/authentication";
import { followUser, getAllUsers, getUserByEmail, getUserById, updateUser } from "../controllers/user";
import upload from "../middleware/uploadFile";
import validationId from "../middleware/validation";

const router = express.Router();

router.get("/", authentication, getAllUsers);
router.patch("/", authentication, upload.single("image"), updateUser);
router.get("/email/:email", getUserByEmail);
router.get("/:id", authentication, validationId("user"), getUserById);
router.patch("/follow/:id", authentication, validationId("user"), followUser);

const UserRouter = router;
export default UserRouter;
