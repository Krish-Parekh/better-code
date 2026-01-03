import type { Request, Response, NextFunction } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import db from "../db";
import type { IProblem, IResponse } from "../types/main";

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
			with: {
				problemCompanies: {
					with: {
						company: true,
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

		const payload: IResponse<typeof problem> = {
			status: StatusCodes.OK,
			message: ReasonPhrases.OK,
			data: problem,
		};

		return response.status(StatusCodes.OK).json(payload);
	} catch (error) {
		next(error);
	}
}

export { getProblems, getProblemById };
