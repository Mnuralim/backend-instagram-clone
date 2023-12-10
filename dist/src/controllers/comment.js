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
exports.replyComment = exports.getAllComments = exports.addNewComment = void 0;
const apiError_1 = __importDefault(require("../utils/apiError"));
const comment_1 = __importDefault(require("../models/comment"));
const post_1 = __importDefault(require("../models/post"));
const addNewComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { text } = req.body;
    try {
        const post = yield post_1.default.findById(id);
        yield comment_1.default.create({
            user: req.user._id,
            post: id,
            replies: [],
            text
        });
        if (post) {
            const prevTotalComment = post.totalComment;
            post.totalComment = prevTotalComment + 1;
            yield (post === null || post === void 0 ? void 0 : post.save());
        }
        res.status(201).json({
            success: true,
            message: 'Add comment successfully'
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
});
exports.addNewComment = addNewComment;
const getAllComments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const comments = yield comment_1.default.find({
            post: id
        })
            .select('-__v')
            .populate({
            path: 'post',
            select: '-__v',
            populate: {
                path: 'userId likedBy',
                model: 'User',
                select: 'profile _id username'
            }
        })
            .populate({
            path: 'replies',
            select: '-__v',
            populate: {
                path: 'user',
                model: 'User',
                select: 'profile _id username'
            }
        })
            .populate('user', 'profile username')
            .sort('-createdAt');
        res.status(200).json({
            success: true,
            data: {
                comments
            }
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
});
exports.getAllComments = getAllComments;
const replyComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentid } = req.params;
    const { text } = req.body;
    try {
        const comment = yield comment_1.default.findById(commentid).populate('post');
        if (!comment) {
            next(new apiError_1.default('Comment not found', 404));
            return;
        }
        const post = yield post_1.default.findById(comment.post);
        if (!post) {
            next(new apiError_1.default('Post not found', 404));
            return;
        }
        comment.replies.push({
            text,
            user: req.user._id
        });
        const prevTotalComment = post.totalComment;
        post.totalComment = prevTotalComment + 1;
        yield post.save();
        yield comment.save();
        res.status(201).json({
            success: true,
            message: 'Add comment successfully'
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
});
exports.replyComment = replyComment;
