import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { errorMiddleware } from "./middlewares/error.middleware";
import authRouter from "./routers/auth.routers";
import problemsRouter from "./routers/problems.routers";
// import "./db/seed/companies";
// import "./db/seed/problems";
// import "./db/seed/problem_companies";
// import "./db/seed/test_cases";
import "./utils/cleanup";

dotenv.config({
	path: ".env",
});

const app = express();

app.use(
	cors({
		origin: process.env.FRONTEND_URL!,
		allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
		credentials: true,
	}),
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/problems", problemsRouter);

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
});
