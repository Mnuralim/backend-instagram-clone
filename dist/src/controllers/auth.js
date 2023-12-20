"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkMe = exports.logOut = exports.loginWithGoogle = exports.loginWithCredential = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const user_1 = __importDefault(require("../models/user"));
const register = async (req, res, next) => {
    const { username, password, email } = req.body;
    try {
        const user = await user_1.default.findOne({ email });
        const findUsername = await user_1.default.findOne({ username });
        if (user != null) {
            next(new apiError_1.default('Email already registered', 400));
            return;
        }
        if (findUsername != null) {
            next(new apiError_1.default('Username already exist', 400));
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        await user_1.default.create({
            email,
            username,
            password: hashedPassword
        });
        return res.status(201).json({
            success: true,
            message: 'Register successfully'
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
};
exports.register = register;
const loginWithCredential = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await user_1.default.findOne({ email });
        if (user == null) {
            next(new apiError_1.default('User not found', 404));
            return;
        }
        const match = await bcrypt_1.default.compare(password, user.password);
        if (!match) {
            next(new apiError_1.default('Wrong password', 400));
            return;
        }
        const payload = {
            _id: user._id,
            username: user.username,
            email: user.email
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });
        const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.REFRESHTOKEN_SECRET, {
            expiresIn: '1d'
        });
        user.refreshToken = refreshToken;
        await user.save();
        res.cookie('refreshToken', refreshToken);
        res.status(200).json({
            success: true,
            message: 'Login successfully',
            data: {
                accessToken,
                _id: user._id,
                email: user.email,
                username: user.username
            }
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
};
exports.loginWithCredential = loginWithCredential;
const loginWithGoogle = async (req, res, next) => {
    const { email, imageProfile, fullName } = req.body;
    try {
        const user = await user_1.default.findOne({ email });
        let loginUser = user;
        const username = email.split('@')[0];
        if (user == null) {
            loginUser = await user_1.default.create({
                email,
                username,
                profile: {
                    imageProfile,
                    fullName
                }
            });
        }
        const payload = {
            _id: loginUser === null || loginUser === void 0 ? void 0 : loginUser._id,
            username: loginUser === null || loginUser === void 0 ? void 0 : loginUser.username,
            email: loginUser === null || loginUser === void 0 ? void 0 : loginUser.email
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });
        const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.REFRESHTOKEN_SECRET, {
            expiresIn: '1d'
        });
        if (loginUser) {
            loginUser.refreshToken = refreshToken;
            await (loginUser === null || loginUser === void 0 ? void 0 : loginUser.save());
        }
        res.cookie('refreshToken', refreshToken);
        res.status(200).json({
            success: true,
            message: 'Login successfully',
            data: {
                accessToken
            }
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
};
exports.loginWithGoogle = loginWithGoogle;
const logOut = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken)
            return res.sendStatus(204);
        const user = await user_1.default.findOne({
            refreshToken
        });
        if (!user)
            return res.sendStatus(204);
        user.refreshToken = '';
        await user.save();
        res.clearCookie('refreshToken');
        res.status(200).json({
            success: true,
            message: 'Logout successfully'
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
};
exports.logOut = logOut;
const checkMe = async (req, res, next) => {
    try {
        const user = await user_1.default.findById(req.user._id).select('-password -refreshToken -passwordResetExpires -passwordResetToken -__v');
        res.status(200).json({
            success: true,
            data: {
                user
            }
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
};
exports.checkMe = checkMe;
