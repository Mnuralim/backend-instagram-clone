"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllLikes = exports.likePost = exports.updatePost = exports.deletePost = exports.getPostById = exports.getAllPost = exports.createPost = void 0;
const apiError_1 = __importDefault(require("../utils/apiError"));
const imagekit_1 = __importDefault(require("../utils/imagekit"));
const post_1 = __importDefault(require("../models/post"));
const user_1 = __importDefault(require("../models/user"));
const createPost = async (req, res, next) => {
    const { caption, type } = req.body;
    try {
        const file = req.file;
        if (!file) {
            next(new apiError_1.default('File not found', 400));
            return;
        }
        const split = file.originalname.split('.');
        const ext = split[split.length - 1];
        const uploadedFile = await imagekit_1.default.upload({
            file: file.buffer,
            fileName: `${type === 'post' ? 'POST' : 'REEL'}-${Date.now()}.${ext}`,
            folder: 'instagram-clone/post'
        });
        await post_1.default.create({
            userId: req.user._id,
            caption,
            type,
            media: uploadedFile.url
        });
        const user = (await user_1.default.findById(req.user._id).select('totalPost'));
        const totalPost = user.totalPost;
        user.totalPost = totalPost + 1;
        await user.save();
        res.status(201).json({
            success: true,
            message: 'Create new post successfully'
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
};
exports.createPost = createPost;
const getAllPost = async (req, res, next) => {
    const { author, limit } = req.query;
    try {
        const filterPost = {
            userId: ''
        };
        if (author) {
            filterPost.userId = author;
        }
        const posts = await post_1.default.find(filterPost)
            .populate('likedBy', 'profile _id username createdAt')
            .populate('userId', 'profile _id username')
            .sort({ createdAt: -1 })
            .select('-__v')
            .limit(parseInt(limit));
        const allPosts = posts.map((post) => {
            const alreadyLike = post.likedBy.find((el) => { var _a; return el._id.toString() === ((_a = req.user._id) === null || _a === void 0 ? void 0 : _a.toString()); });
            return Object.assign(Object.assign({}, post.toObject()), { alreadyLike: !!alreadyLike });
        });
        res.status(200).json({
            success: true,
            data: {
                posts: allPosts
            }
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
};
exports.getAllPost = getAllPost;
const getPostById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const post = (await post_1.default.findById(id)
            .populate('likedBy')
            .populate('userId', '-__v -password -refreshToken -passwordResetExp -passwordResetToken'));
        const alreadyLike = post.likedBy.find((el) => { var _a; return el._id.toString() === ((_a = req.user._id) === null || _a === void 0 ? void 0 : _a.toString()); });
        const singlePost = Object.assign(Object.assign({}, post.toObject()), { alreadyLike: !!alreadyLike });
        res.status(200).json({
            success: true,
            data: {
                post: singlePost
            }
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
};
exports.getPostById = getPostById;
const deletePost = async (req, res, next) => {
    var _a;
    const { id } = req.params;
    try {
        const post = await post_1.default.findById(id);
        if ((post === null || post === void 0 ? void 0 : post.userId.toString()) !== ((_a = req.user._id) === null || _a === void 0 ? void 0 : _a.toString())) {
            next(new apiError_1.default('You are not allowed', 401));
            return;
        }
        await post_1.default.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: 'Delete post successfully'
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
};
exports.deletePost = deletePost;
const updatePost = async (req, res, next) => {
    const { id } = req.params;
    const { caption } = req.body;
    try {
        await post_1.default.findByIdAndUpdate(id, {
            caption
        }, {
            new: true
        });
        res.status(200).json({
            success: true,
            message: 'Update post successfully'
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
};
exports.updatePost = updatePost;
const likePost = async (req, res, next) => {
    const { id } = req.params;
    try {
        const post = await post_1.default.findById(id);
        const likedBy = post === null || post === void 0 ? void 0 : post.likedBy;
        const isLiked = likedBy === null || likedBy === void 0 ? void 0 : likedBy.find((data) => { var _a; return data.toString() === ((_a = req.user._id) === null || _a === void 0 ? void 0 : _a.toString()); });
        let message = '';
        if (post) {
            const totalLike = post.totalLike;
            if (!isLiked) {
                post.likedBy.push(req.user._id);
                post.totalLike = totalLike + 1;
                await post.save();
                message = 'You already like this post';
            }
            else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                post.likedBy.pull(req.user._id);
                post.totalLike = totalLike - 1;
                await post.save();
                message = 'You already dislike this post';
            }
        }
        res.status(200).json({
            success: true,
            message
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
};
exports.likePost = likePost;
const getAllLikes = async (req, res, next) => {
    const { id } = req.params;
    try {
        const post = (await post_1.default.findById(id).populate('likedBy', 'profile username follower'));
        const likes = post.likedBy;
        const allLikes = likes.map((like) => {
            const alreadyFollow = like.follower.find((el) => { var _a; return el._id.toString() === ((_a = req.user._id) === null || _a === void 0 ? void 0 : _a.toString()); });
            return Object.assign(Object.assign({}, like.toObject()), { alreadyFollow: !!alreadyFollow });
        });
        res.status(200).json({
            success: true,
            allLikes
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
};
exports.getAllLikes = getAllLikes;
