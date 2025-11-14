import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import ejs from "ejs";
import express from "express";
import { join } from "path";
import { errorMiddleware } from "./middlewares/error.middleware";
import { auth } from "./utils/auth";

dotenv.config({
	path: ".env",
});

const app = express();

app.set("view engine", "ejs");
app.set("views", join(process.cwd(), "src", "templates"));
app.engine("ejs", ejs.renderFile);

app.use(
	cors({
		origin: process.env.BETTER_AUTH_URL!,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
		credentials: true,
	}),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(cookieParser());
app.use(express.json());

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
});
