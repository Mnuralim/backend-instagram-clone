import express, { Express } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import errorHandler from "./controllers/errorHandler";
import ApiError from "./utils/apiError";
import AuthRouter from "./routes/auth";
import UserRouter from "./routes/user";
import PostRouter from "./routes/post";
import HistoryRouter from "./routes/historySearch";
import CommentRouter from "./routes/comment";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use(cookieParser());

app.use("/api/v1/auths", AuthRouter);
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/posts", PostRouter);
app.use("/api/v1/comments", CommentRouter);
app.use("/api/v1/histories", HistoryRouter);

app.all("*", (req, res, next) => {
  next(new ApiError(`Routes does not exist`, 404));
});
app.use(errorHandler);

export default app;
