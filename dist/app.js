"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const messageRoute_1 = __importDefault(require("./routes/messageRoute"));
const errorHandler_1 = __importDefault(require("./controllers/errorHandler"));
const apiError_1 = __importDefault(require("./utils/apiError"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
app.use("/api/v1/users", userRoute_1.default);
app.use("/api/v1/messages", messageRoute_1.default);
app.all("*", (req, res, next) => {
    next(new apiError_1.default(`Routes does not exist`, 404));
});
app.use(errorHandler_1.default);
exports.default = app;
