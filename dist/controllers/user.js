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
exports.addUser = exports.getUserById = exports.getUserByEmail = exports.updateUser = exports.getAllUsers = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const uploaderFile_1 = require("../utils/uploaderFile");
const apiError_1 = __importDefault(require("../utils/apiError"));
const addUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, profileImage, displayName } = req.body;
    try {
        const newUser = yield userModel_1.default.create({
            email,
            username,
            profile_image: profileImage,
            display_name: displayName,
        });
        res.status(201).json({
            success: true,
            data: {
                user: newUser,
            },
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
});
exports.addUser = addUser;
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = res.locals.user;
        res.status(200).json({
            success: true,
            data: {
                user: user,
            },
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
});
exports.getUserById = getUserById;
const getUserByEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    try {
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            return next(new apiError_1.default("user not found", 404));
        }
        res.status(200).json({
            success: true,
            data: {
                user: user,
            },
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
});
exports.getUserByEmail = getUserByEmail;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { username, about } = req.body;
    const user = res.locals.user;
    try {
        const files = (req === null || req === void 0 ? void 0 : req.files) || {};
        //@ts-ignore
        const imagePath = (_a = files === null || files === void 0 ? void 0 : files.image) === null || _a === void 0 ? void 0 : _a[0].path;
        let urlImage = user === null || user === void 0 ? void 0 : user.profile_image;
        if (imagePath) {
            const date = new Date();
            const imagePublicId = `profileimage${date.getTime()}${user === null || user === void 0 ? void 0 : user._id}`;
            const imageResult = yield (0, uploaderFile_1.uploader)(imagePath, imagePublicId);
            urlImage = imageResult.secure_url;
        }
        const updateUserData = yield userModel_1.default.findByIdAndUpdate(user._id, {
            username,
            about,
            profile_image: urlImage,
        }, {
            new: true,
        });
        res.status(200).json({
            success: true,
            data: {
                user: updateUserData,
            },
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
});
exports.updateUser = updateUser;
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find().select("-__v").sort("username");
        res.status(200).json({
            success: true,
            data: {
                users,
            },
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
});
exports.getAllUsers = getAllUsers;
