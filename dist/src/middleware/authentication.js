"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const user_1 = __importDefault(require("../models/user"));
const authentication = async (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization;
        if (!bearerToken) {
            next(new apiError_1.default('No token', 401));
            return;
        }
        const token = bearerToken.split(' ')[1];
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await user_1.default.findById(payload._id);
        req.user = user;
        next();
    }
    catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        next(new apiError_1.default(error.message, 500));
    }
};
exports.default = authentication;
