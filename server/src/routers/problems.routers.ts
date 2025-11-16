import { Router } from "express";
import getProblems from "../controllers/problems.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const problemsRouter = Router();

problemsRouter.get("/", authMiddleware, getProblems);

export default problemsRouter;
