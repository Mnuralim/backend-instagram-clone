"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const post_1 = __importDefault(require("../models/post"));
const historySearch_1 = __importDefault(require("../models/historySearch"));
const validationId = (model) => {
    if (model === 'user') {
        return async (req, res, next) => {
            const { id } = req.params;
            const user = await user_1.default.findById(id);
            if (!user) {
                next(new apiError_1.default('User not found', 404));
                return;
            }
            next();
        };
    }
    else if (model === 'post') {
        return async (req, res, next) => {
            const { id } = req.params;
            const post = await post_1.default.findById(id);
            if (!post) {
                next(new apiError_1.default('Post not found', 404));
                return;
            }
            next();
        };
    }
    else {
        return async (req, res, next) => {
            const { id } = req.params;
            const history = await historySearch_1.default.findById(id);
            if (!history) {
                next(new apiError_1.default('History not found', 404));
                return;
            }
            next();
        };
    }
};
exports.default = validationId;
