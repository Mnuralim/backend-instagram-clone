"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const penggunaSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    mobilePhone: {
        type: String,
    },
    name: {
        type: String,
    },
    imageProfile: {
        type: String,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        defaultValue: "user",
    },
    isActive: {
        type: Boolean,
        defaultValue: false,
    },
}, {
    timestamps: true,
});
const Pengguna = mongoose_1.default.model("Pengguna", penggunaSchema);
exports.default = Pengguna;
