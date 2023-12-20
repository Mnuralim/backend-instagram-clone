"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllHistory = exports.deleteHistory = exports.getAllHistory = exports.addHistory = void 0;
const apiError_1 = __importDefault(require("../utils/apiError"));
const historySearch_1 = __importDefault(require("../models/historySearch"));
const user_1 = __importDefault(require("../models/user"));
const addHistory = async (req, res, next) => {
    const { targetUser } = req.params;
    try {
        const user = await user_1.default.findById(targetUser);
        if (!user) {
            next(new apiError_1.default('User not found', 404));
            return;
        }
        const alreadyAddToHistory = await historySearch_1.default.findOne({
            userId: req.user._id,
            savedUser: targetUser
        });
        if (!alreadyAddToHistory) {
            await historySearch_1.default.create({
                userId: req.user._id,
                savedUser: targetUser
            });
        }
        else {
            await historySearch_1.default.updateOne({
                userId: req.user._id,
                savedUser: targetUser
            }, {
                savedUser: targetUser
            });
        }
        res.status(201).json({
            success: true,
            message: 'Add to history successfully'
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
};
exports.addHistory = addHistory;
const getAllHistory = async (req, res, next) => {
    try {
        const histories = await historySearch_1.default.find({ userId: req.user._id })
            .populate('userId', '_id username profile')
            .populate('savedUser', '_id username profile')
            .sort('-updatedAt');
        res.status(201).json({
            success: true,
            data: {
                histories
            }
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
};
exports.getAllHistory = getAllHistory;
const deleteHistory = async (req, res, next) => {
    const { id } = req.params;
    try {
        await historySearch_1.default.findByIdAndDelete(id);
        res.status(201).json({
            success: true,
            message: 'Delete history successfully'
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
};
exports.deleteHistory = deleteHistory;
const deleteAllHistory = async (req, res, next) => {
    try {
        await historySearch_1.default.deleteMany({
            userId: req.user._id
        });
        res.status(201).json({
            success: true,
            message: 'Delete all history successfully'
        });
    }
    catch (error) {
        next(new apiError_1.default(error.message, 500));
    }
};
exports.deleteAllHistory = deleteAllHistory;
