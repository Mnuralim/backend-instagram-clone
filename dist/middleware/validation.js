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
const user_1 = __importDefault(require("../models/user"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const post_1 = __importDefault(require("../models/post"));
const historySearch_1 = __importDefault(require("../models/historySearch"));
const validationId = (model) => {
    if (model === "user") {
        return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            const { id } = req.params;
            const user = yield user_1.default.findById(id);
            if (!user)
                return next(new apiError_1.default("User not found", 404));
            next();
        });
    }
    else if (model === "post") {
        return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            const { id } = req.params;
            const post = yield post_1.default.findById(id);
            if (!post)
                return next(new apiError_1.default("Post not found", 404));
            next();
        });
    }
    else {
        return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            const { id } = req.params;
            const history = yield historySearch_1.default.findById(id);
            if (!history)
                return next(new apiError_1.default("History not found", 404));
            next();
        });
    }
};
exports.default = validationId;
