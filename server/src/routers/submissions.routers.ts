import { Router } from "express";
import { createSubmission, getSubmissionStatus } from "../controllers/submission.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const submissionsRouter = Router();

submissionsRouter.post("/", authMiddleware, createSubmission);
submissionsRouter.get("/:jobId/status", authMiddleware, getSubmissionStatus);

export default submissionsRouter;
