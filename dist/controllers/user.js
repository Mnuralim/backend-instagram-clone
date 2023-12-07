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
exports.followUser = exports.getUserByEmail = exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
const user_1 = __importDefault(require("../models/user"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const imagekit_1 = __importDefault(require("../utils/imagekit"));
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { suggestion, username } = req.query;
    try {
        let suggestionOpt = false;
        if (suggestion === "true") {
            suggestionOpt = true;
        }
        else {
            suggestionOpt = false;
        }
        const filterData = {};
        if (username) {
            filterData.username = { $regex: ".*" + username + ".*", $options: "i" };
        }
        const users = yield user_1.default.find(filterData).select("-password -refreshToken -passwordResetExpires -passwordResetToken -__v");
        const allUsers = users
            .map((user) => {
            const alreadyFollow = user.follower.find((el) => { var _a; return el.toString() === ((_a = req.user._id) === null || _a === void 0 ? void 0 : _a.toString()); });
            return Object.assign(Object.assign({}, user.toObject()), { alreadyFollow: alreadyFollow ? true : false });
        })
            .filter((user) => { var _a, _b; return (suggestionOpt ? user._id.toString() !== ((_a = req.user._id) === null || _a === void 0 ? void 0 : _a.toString()) && user.alreadyFollow === false : user._id.toString() !== ((_b = req.user._id) === null || _b === void 0 ? void 0 : _b.toString())); });
        res.status(200).json({
            success: true,
            data: {
                users: allUsers,
            },
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
});
exports.getAllUsers = getAllUsers;
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = (yield user_1.default.findById(id).select("-password -refreshToken -passwordResetExpires -passwordResetToken -__v"));
        const alreadyFollow = user.follower.find((el) => { var _a; return el.toString() === ((_a = req.user._id) === null || _a === void 0 ? void 0 : _a.toString()); });
        res.status(200).json({
            success: true,
            data: {
                user: Object.assign(Object.assign({}, user.toObject()), { alreadyFollow: alreadyFollow ? true : false }),
            },
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
});
exports.getUserById = getUserById;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    const { fullName, username, bio, link } = req.body;
    try {
        const user = (yield user_1.default.findById(_id));
        const findUsername = (yield user_1.default.findOne({ username }));
        if (!user)
            return next(new apiError_1.default("User not found", 404));
        if (findUsername && findUsername.username !== user.username)
            return next(new apiError_1.default("Username already taken", 404));
        const file = req.file;
        let imgUrl = "";
        if (file) {
            const split = file.originalname.split(".");
            const ext = split[split.length - 1];
            const uploadedImage = yield imagekit_1.default.upload({
                file: file.buffer,
                fileName: `IMG-USER-PROFILE${Date.now()}.${ext}`,
                folder: "instagram-clone/user_profile",
            });
            imgUrl = uploadedImage.url;
        }
        else {
            imgUrl = user.profile.imageProfile;
        }
        user.profile.imageProfile = imgUrl;
        user.profile.bio = bio;
        user.profile.fullName = fullName;
        user.profile.link = link;
        user.username = username;
        yield user.save();
        res.status(201).json({
            success: true,
            message: "Updated user successfully",
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
});
exports.updateUser = updateUser;
const getUserByEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    try {
        const user = yield user_1.default.findOne({ email }).select("-password -refreshToken -passwordResetExpires -passwordResetToken -__v");
        if (!user)
            return next(new apiError_1.default("User not found", 404));
        res.status(200).json({
            success: true,
            data: {
                user,
            },
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
});
exports.getUserByEmail = getUserByEmail;
const followUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: currentUserId } = req.user;
    const { id: targetUserId } = req.params;
    try {
        const currentUser = yield user_1.default.findById(currentUserId);
        const targetUser = yield user_1.default.findById(targetUserId);
        if (!currentUser || !targetUser)
            return next(new apiError_1.default("User not found", 404));
        if (currentUser._id.toString() === targetUser._id.toString())
            return next(new apiError_1.default("You cannot follow or unfollow yourself", 400));
        const alreadyFollow = currentUser.following.find((data) => data.toString() === targetUser._id.toString());
        let message = "";
        if (!alreadyFollow) {
            currentUser.following.push(targetUser._id);
            targetUser.follower.push(currentUser._id);
            //update number of follower and following
            currentUser.totalFollowing = currentUser.following.length;
            targetUser.totalFollower = targetUser.follower.length;
            yield currentUser.save();
            yield targetUser.save();
            message = "You are follow this user";
        }
        else {
            // @ts-ignore
            currentUser.following.pull(targetUser._id);
            // @ts-ignore
            targetUser.follower.pull(currentUser._id);
            //update number of follower and following
            currentUser.totalFollowing = currentUser.following.length;
            targetUser.totalFollower = targetUser.follower.length;
            yield currentUser.save();
            yield targetUser.save();
            message = "You are unfollow this user";
        }
        res.status(200).json({
            success: true,
            message,
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
});
exports.followUser = followUser;
