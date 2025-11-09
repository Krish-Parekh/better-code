import { Router } from "express";
import { login, refresh, register } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/refresh", refresh);
authRouter.post("/register", register);

export default authRouter;
