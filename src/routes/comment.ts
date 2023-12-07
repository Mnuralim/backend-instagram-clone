import express from "express";
import authentication from "../middleware/authentication";
import validationId from "../middleware/validation";
import { addNewComment, getAllComments, replyComment } from "../controllers/comment";

const router = express.Router();

router.post("/replies/:commentid", authentication, replyComment);
router.post("/:id", authentication, validationId("post"), addNewComment);
router.get("/:id", authentication, validationId("post"), getAllComments);

const CommentRouter = router;
export default CommentRouter;
