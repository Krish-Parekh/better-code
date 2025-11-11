import { Router } from "express";
import { login, refresh, register } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/refresh", authMiddleware, refresh);
authRouter.post("/register", register);

export default authRouter;
