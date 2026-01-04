import { desc, eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import db from "../db";
import { submissions } from "../db/schema/submissions";
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
		const { id } = request.params;

		if (!id) {
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

		const job = await submissionsQueue.getJob(id);
		if (!job) {
			const payload = JSON.stringify({ error: "Job not found" });
			response.write(`data: ${payload}\n\n`);
			response.end();
			return;
		}

		const progressListener = async ({ jobId, data }: any) => {
			if (jobId === id) {
				const dataObject = typeof data === "string" ? JSON.parse(data) : data;
				const payload = JSON.stringify({
					status: "PROGRESS",
					index: dataObject.index,
				});
				response.write(`data: ${payload}\n\n`);
			}
		};

		const completedListener = async ({ jobId, data }: any) => {
			if (jobId === id) {
				const dataObject = typeof data === "string" ? JSON.parse(data) : data;
				const payload = JSON.stringify({
					status: "COMPLETED",
					index: dataObject.index,
				});
				response.write(`data: ${payload}\n\n`);
			}
		};

		const failedListener = async ({ jobId, data }: any) => {
			if (jobId === id) {
				const dataObject = typeof data === "string" ? JSON.parse(data) : data;
				const payload = JSON.stringify({
					status: "FAILED",
					index: dataObject.index,
				});
				response.write(`data: ${payload}\n\n`);
			}
		};

		queueEvents.on("progress", progressListener);
		queueEvents.on("completed", completedListener);
		queueEvents.on("failed", failedListener);

		const cleanup = () => {
			queueEvents.off("progress", progressListener);
			queueEvents.off("completed", completedListener);
			queueEvents.off("failed", failedListener);
			response.end();
		};

		request.on("close", cleanup);
	} catch (error) {
		next(error);
	}
};

export const getSubmissionsByProblemId = async (
	request: Request,
	response: Response,
	next: NextFunction,
) => {
	try {
		const { problemId } = request.params;

		if (!problemId) {
			return response
				.status(StatusCodes.BAD_REQUEST)
				.json({ message: "Problem ID is required" });
		}

		const result = await db
			.select({
				id: submissions.id,
				language: submissions.language,
				runtime_ms: submissions.runtimeMs,
				memory_kb: submissions.memoryKb,
				status: submissions.status,
				createdAt: submissions.createdAt,
			})
			.from(submissions)
			.where(eq(submissions.problemId, problemId))
			.orderBy(desc(submissions.createdAt));

		const payload: IResponse<typeof result> = {
			status: StatusCodes.OK,
			message: ReasonPhrases.OK,
			data: result,
		};
		return response.status(StatusCodes.OK).json(payload);
	} catch (error) {
		next(error);
	}
};
