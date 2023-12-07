import express from "express";
import authentication from "../middleware/authentication";
import upload from "../middleware/uploadFile";
import validationId from "../middleware/validation";
import { createPost, deletePost, getAllLikes, getAllPost, getPostById, likePost, updatePost } from "../controllers/post";

const router = express.Router();

router.patch("/likes/:id", authentication, validationId("post"), likePost);
router.get("/likes/:id", authentication, validationId("post"), getAllLikes);

router.post("/", authentication, upload.single("media"), createPost);
router.get("/", authentication, getAllPost);
router.get("/:id", authentication, validationId("post"), getPostById);
router.delete("/:id", authentication, validationId("post"), deletePost);
router.patch("/:id", authentication, validationId("post"), updatePost);

const PostRouter = router;
export default PostRouter;
