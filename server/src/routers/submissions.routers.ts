import { Router } from "express";
import {
	createSubmission,
	getSubmissionStatus,
	getSubmissionsByProblemId,
} from "../controllers/submission.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const submissionsRouter = Router();

submissionsRouter.post("/", authMiddleware, createSubmission);
submissionsRouter.get(
	"/problem/:problemId",
	authMiddleware,
	getSubmissionsByProblemId,
);
submissionsRouter.get("/:id/status", authMiddleware, getSubmissionStatus);

export default submissionsRouter;
