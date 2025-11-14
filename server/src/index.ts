import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { errorMiddleware } from "./middlewares/error.middleware";
import authRouter from "./routers/auth.routers";
import problemsRouter from "./routers/problems.routers";
import submissionsRouter from "./routers/submissions.routers";

dotenv.config({
	path: ".env",
});

const app = express();

app.use(
	cors({
		origin: process.env.FRONTEND_URL!,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
		credentials: true,
	}),
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/problems", problemsRouter);
app.use("/api/v1/submissions", submissionsRouter);

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
});
