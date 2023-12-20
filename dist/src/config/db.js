"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
const mongoose_1 = __importDefault(require("mongoose"));
const db = async () => {
    try {
        mongoose_1.default.set('strictQuery', false);
        await mongoose_1.default.connect(process.env.MONGO_URL);
        console.log('Database connected');
    }
    catch (error) {
        console.log(error);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        throw new Error(error);
    }
};
exports.db = db;
