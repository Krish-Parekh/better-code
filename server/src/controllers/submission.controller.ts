import type { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import type { IResponse } from "../types/main";
import { queueEvents, submissionsQueue } from "../utils/queue";

export const createSubmission = async (
	request: Request,
	response: Response,
	next: NextFunction,
) => {
	try {
		const { problemId, language, code } = request.body;
		const jobId = await submissionsQueue.add("runSubmission", {
			problemId,
			language,
			code,
		});

		const payload: IResponse<{ jobId: string; statusURL: string }> = {
			status: StatusCodes.CREATED,
			message: ReasonPhrases.CREATED,
			data: {
				jobId: jobId.id as string,
				statusURL: `/submissions/${jobId.id}/status`,
			},
		};
		return response.status(StatusCodes.CREATED).json(payload);
	} catch (error) {
		next(error);
	}
};

export const getSubmissionStatus = async (
	request: Request,
	response: Response,
	next: NextFunction,
) => {
	try {
		const { jobId } = request.params;

		if (!jobId) {
			return response
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: "Job ID is required" });
		}

		response.writeHead(200, {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
		});

		response.flushHeaders();

		const job = await submissionsQueue.getJob(jobId);
		if (!job) {
			response.write(`data: ${JSON.stringify({ error: "Job not found" })}\n\n`);
			response.end();
			return;
		}

		const state = await job.getState();
		
		// Send initial state
		response.write(`data: ${JSON.stringify({ 
			type: "status", 
			status: state,
			message: `Job is ${state}` 
		})}\n\n`);

		// Listen for progress updates
		const progressListener = ({ jobId: eventJobId, data }: any) => {
			if (eventJobId === jobId) {
				const progressData = typeof data === 'string' ? JSON.parse(data) : data;
				response.write(`data: ${JSON.stringify({
					type: progressData.type || "progress",
					...progressData,
				})}\n\n`);
			}
		};

		// Listen for completion
		const completedListener = ({ jobId: eventJobId, returnvalue }: any) => {
			if (eventJobId === jobId) {
				response.write(`data: ${JSON.stringify({
					type: "completed",
					status: "ACCEPTED",
					message: "All test cases passed",
					result: returnvalue,
				})}\n\n`);
				cleanup();
			}
		};

		// Listen for failures
		const failedListener = ({ jobId: eventJobId, failedReason }: any) => {
			if (eventJobId === jobId) {
				response.write(`data: ${JSON.stringify({
					type: "failed",
					status: "REJECTED",
					message: "Submission failed",
					error: failedReason,
				})}\n\n`);
				cleanup();
			}
		};

		// Attach listeners
		queueEvents.on("progress", progressListener);
		queueEvents.on("completed", completedListener);
		queueEvents.on("failed", failedListener);

		// Cleanup function
		const cleanup = () => {
			queueEvents.off("progress", progressListener);
			queueEvents.off("completed", completedListener);
			queueEvents.off("failed", failedListener);
			response.end();
		};

		// Handle client disconnect
		request.on("close", cleanup);

	} catch (error) {
		next(error);
	}
};
