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
exports.deleteAllHistory = exports.deleteHistory = exports.getAllHistory = exports.addHistory = void 0;
const apiError_1 = __importDefault(require("../utils/apiError"));
const historySearch_1 = __importDefault(require("../models/historySearch"));
const user_1 = __importDefault(require("../models/user"));
const addHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { targetUser } = req.params;
    try {
        const user = yield user_1.default.findById(targetUser);
        if (!user)
            return next(new apiError_1.default("User not found", 404));
        const alreadyAddToHistory = yield historySearch_1.default.findOne({
            userId: req.user._id,
            savedUser: targetUser,
        });
        if (!alreadyAddToHistory) {
            yield historySearch_1.default.create({
                userId: req.user._id,
                savedUser: targetUser,
            });
        }
        else {
            yield historySearch_1.default.updateOne({
                userId: req.user._id,
                savedUser: targetUser,
            }, {
                savedUser: targetUser,
            });
        }
        res.status(201).json({
            success: true,
            message: "Add to history successfully",
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
});
exports.addHistory = addHistory;
const getAllHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const histories = yield historySearch_1.default.find({ userId: req.user._id }).populate("userId", "_id username profile").populate("savedUser", "_id username profile").sort("-updatedAt");
        res.status(201).json({
            success: true,
            data: {
                histories,
            },
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
});
exports.getAllHistory = getAllHistory;
const deleteHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield historySearch_1.default.findByIdAndDelete(id);
        res.status(201).json({
            success: true,
            message: "Delete history successfully",
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
});
exports.deleteHistory = deleteHistory;
const deleteAllHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield historySearch_1.default.deleteMany({
            userId: req.user._id,
        });
        res.status(201).json({
            success: true,
            message: "Delete all history successfully",
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
});
exports.deleteAllHistory = deleteAllHistory;
