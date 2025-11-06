import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { errorMiddleware } from "./middlewares/error.middleware";
import authRouter from "./routers/auth.routers";
import cookieParser from "cookie-parser";

dotenv.config({
	path: ".env",
});

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/auth", authRouter);

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
});
