"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const multerFiltering = (req, file, cb) => {
    if (file.mimetype == 'image/png' ||
        file.mimetype == 'image/jpg' ||
        file.mimetype == 'image/jpeg' ||
        file.mimetype == 'video/mp4' ||
        file.mimetype == 'video/webm') {
        cb(null, true);
    }
    else {
        // @ts-ignore
        return cb(new apiError_1.default('Wrong file format', 400), false);
    }
};
const upload = (0, multer_1.default)({
    fileFilter: multerFiltering,
    limits: {
        fileSize: 5000000,
    },
});
exports.default = upload;
