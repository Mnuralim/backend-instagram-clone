import express, { Express } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoute";
import messageRouter from "./routes/messageRoute";
import errorHandler from "./controllers/errorHandler";
import ApiError from "./utils/apiError";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use(cookieParser());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/messages", messageRouter);
app.all("*", (req, res, next) => {
  next(new ApiError(`Routes does not exist`, 404));
});
app.use(errorHandler);

export default app;
