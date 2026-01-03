import { asc, eq } from "drizzle-orm";
import type { Request, Response, NextFunction } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import db from "../db";
import { problems } from "../db/schema/problems";
import { testCases } from "../db/schema/testcases";
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

		const [problem] = await db
			.select({
				id: problems.id,
				title: problems.title,
				bodyMdx: problems.bodyMdx,
				codeSnippets: problems.codeSnippets,
			})
			.from(problems)
			.where(eq(problems.id, id as string))
			.limit(1);

		if (!problem) {
			const payload: IResponse<null> = {
				status: StatusCodes.NOT_FOUND,
				message: ReasonPhrases.NOT_FOUND,
			};
			return response.status(StatusCodes.NOT_FOUND).json(payload);
		}

		const testCasesData = await db
			.select({
				id: testCases.id,
				input: testCases.input,
				output: testCases.output,
			})
			.from(testCases)
			.where(eq(testCases.problemId, id as string))
			.orderBy(asc(testCases.order));

		// Transform codeSnippets to templates format
		const codeSnippets = problem.codeSnippets as {
			python?: { template: string };
			javascript?: { template: string };
			cpp?: { template: string };
		};

		const templates = {
			python: codeSnippets.python?.template || "",
			javascript: codeSnippets.javascript?.template || "",
			java: codeSnippets.cpp?.template || "", 
		};

		const testCasesResult = testCasesData.map((tc) => ({
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
			testCases: testCasesResult,
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
