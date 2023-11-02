"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({});
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5000000,
    },
}).fields([
    {
        name: "audio",
        maxCount: 1,
    },
    {
        name: "image",
        maxCount: 1,
    },
]);
