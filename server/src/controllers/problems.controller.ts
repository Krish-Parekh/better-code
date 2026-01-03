import type { Request, Response, NextFunction } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import db from "../db";
import type { IProblem, IResponse, IProblemById } from "../types/main";

const getLatestSubmissionStatus = (
	submissions: Array<{ status: string; createdAt: Date }>,
): IProblem["submissions"] =>
	(submissions.toSorted(
		(a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
	)[0]?.status as IProblem["submissions"]) || "NOT_SUBMITTED";

const getTopCompanies = (
	problemCompanies: Array<{
		frequency: number;
		company: { name: string; logoUrl: string };
	}>,
): IProblem["companies"] =>
	problemCompanies
		.toSorted((a, b) => b.frequency - a.frequency)
		.slice(0, 3)
		.map((pc) => pc.company);

async function getProblems(
	_request: Request,
	response: Response,
	next: NextFunction,
) {
	try {
		const problemsData = await db.query.problems.findMany({
			columns: {
				id: true,
				title: true,
				slug: true,
				isPaid: true,
			},
			with: {
				problemCompanies: {
					columns: {
						frequency: true,
					},
					with: {
						company: {
							columns: {
								name: true,
								logoUrl: true,
							},
						},
					},
				},
				submissions: {
					columns: {
						status: true,
						createdAt: true,
					},
				},
			},
		});

		const result: IProblem[] = problemsData.map((problem) => ({
			id: problem.id,
			title: problem.title,
			slug: problem.slug,
			isPaid: problem.isPaid,
			submissions: getLatestSubmissionStatus(problem.submissions),
			companies: getTopCompanies(problem.problemCompanies),
		}));

		const payload: IResponse<IProblem[]> = {
			status: StatusCodes.OK,
			message: ReasonPhrases.OK,
			data: result,
		};

		return response.status(StatusCodes.OK).json(payload);
	} catch (error) {
		next(error);
	}
}

async function getProblemById(
	request: Request,
	response: Response,
	next: NextFunction,
) {
	try {
		const { id } = request.params;
		const problem = await db.query.problems.findFirst({
			columns: {
				id: true,
				title: true,
				bodyMdx: true,
				codeSnippets: true,
			},
			with: {
				testCases: {
					columns: {
						id: true,
						input: true,
						output: true,
						order: true,
					},
				},
			},
			where: (problems, { eq }) => eq(problems.id, id as string),
		});

		if (!problem) {
			const payload: IResponse<null> = {
				status: StatusCodes.NOT_FOUND,
				message: ReasonPhrases.NOT_FOUND,
			};
			return response.status(StatusCodes.NOT_FOUND).json(payload);
		}

		// Transform codeSnippets to templates format
		const codeSnippets = problem.codeSnippets as {
			python?: { template: string };
			javascript?: { template: string };
			cpp?: { template: string };
		};

		const templates = {
			python: codeSnippets.python?.template || "",
			javascript: codeSnippets.javascript?.template || "",
			java: codeSnippets.cpp?.template || "", // Map cpp to java for now, or add java support later
		};

		// Transform test cases to expected format (sorted by order)
		const testCases = problem.testCases
			.sort((a, b) => (a.order || 0) - (b.order || 0))
			.map((tc) => ({
				testCaseId: tc.id,
				input: tc.input,
				output: tc.output,
			}));

		const result: IProblemById = {
			id: problem.id,
			title: problem.title,
			bodyMdx: problem.bodyMdx,
			metadata: {
				templates,
			},
			testCases,
		};

		const payload: IResponse<IProblemById> = {
			status: StatusCodes.OK,
			message: ReasonPhrases.OK,
			data: result,
		};

		return response.status(StatusCodes.OK).json(payload);
	} catch (error) {
		next(error);
	}
}

export { getProblems, getProblemById };
