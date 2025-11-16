import { Router } from "express";
import getProblems, { getProblemById } from "../controllers/problems.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const problemsRouter = Router();

problemsRouter.get("/", authMiddleware, getProblems);
problemsRouter.get("/:id", authMiddleware, getProblemById);
export default problemsRouter;
