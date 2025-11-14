import { Router } from "express";
import {
	createSubmission,
	getSubmissionStatus,
} from "../controllers/submission.controller";

const submissionsRouter = Router();

submissionsRouter.post("/", createSubmission);
submissionsRouter.get("/:jobId/status", getSubmissionStatus);

export default submissionsRouter;
