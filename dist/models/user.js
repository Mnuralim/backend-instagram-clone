"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
    },
    password: {
        type: String,
    },
    profile: {
        fullName: {
            type: String,
            default: '',
        },
        birth: Date,
        address: String,
        gender: String,
        imageProfile: {
            type: String,
            default: 'https://ik.imagekit.io/ku9epk6lrv/user%20(1).png?updatedAt=1701280630365',
        },
        bio: {
            type: String,
            default: '',
        },
        link: {
            type: String,
            default: '',
        },
    },
    follower: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    following: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    totalFollower: {
        type: Number,
        default: 0,
    },
    totalFollowing: {
        type: Number,
        default: 0,
    },
    totalPost: {
        type: Number,
        default: 0,
    },
    refreshToken: {
        type: String || null,
        default: null,
    },
    passwordResetExp: {
        type: Date,
    },
    passwordResetToken: {
        type: String || null,
        default: null,
    },
    passwordUpdatedAt: Date,
}, {
    timestamps: true,
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
