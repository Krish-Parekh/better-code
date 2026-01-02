import { Router } from "express";
import {
	createSubmission,
	getSubmissionStatus,
	getSubmissionsByProblemId,
} from "../controllers/submission.controller";

const submissionsRouter = Router();

submissionsRouter.post("/", createSubmission);
submissionsRouter.get("/problem/:problemId", getSubmissionsByProblemId);
submissionsRouter.get("/:jobId/status", getSubmissionStatus);

export default submissionsRouter;
