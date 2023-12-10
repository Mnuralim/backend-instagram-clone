"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = __importDefault(require("../middleware/authentication"));
const validation_1 = __importDefault(require("../middleware/validation"));
const comment_1 = require("../controllers/comment");
const router = express_1.default.Router();
router.post('/replies/:commentid', authentication_1.default, comment_1.replyComment);
router.post('/:id', authentication_1.default, (0, validation_1.default)('post'), comment_1.addNewComment);
router.get('/:id', authentication_1.default, (0, validation_1.default)('post'), comment_1.getAllComments);
const CommentRouter = router;
exports.default = CommentRouter;
