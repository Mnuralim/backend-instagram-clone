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
exports.checkSenderAndReceiver = exports.userExists = exports.checkBody = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const checkBody = (req, res, next) => {
    if (!req.body.message) {
        return res.status(400).json({
            message: "Message field are required",
        });
    }
    next();
};
exports.checkBody = checkBody;
const userExists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userid } = req.params;
    try {
        const user = yield userModel_1.default.findById(userid).select("-__v");
        if (!user) {
            return next(new apiError_1.default("User not found", 404));
        }
        res.locals.user = user;
        next();
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
});
exports.userExists = userExists;
const checkSenderAndReceiver = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, to } = req.params;
    try {
        const sender = yield userModel_1.default.findById(from);
        const receiver = yield userModel_1.default.findById(to);
        if (!sender || !receiver) {
            return next(new apiError_1.default("sender or receiver not found", 400));
        }
        next();
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
});
exports.checkSenderAndReceiver = checkSenderAndReceiver;
