import { Router } from "express";
import { createSubmission } from "../controllers/submission.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const submissionsRouter = Router();

submissionsRouter.post("/", authMiddleware, createSubmission);

export default submissionsRouter;
