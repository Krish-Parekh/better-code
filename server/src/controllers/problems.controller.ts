import { eq, sql } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import db from "../db";
import { problems } from "../db/schema/problems";
import { submissions } from "../db/schema/submissions";
import { testCases } from "../db/schema/test_cases";
import type { ICompany, IProblem, IResponse, IProblemById, ITestCase } from "../types/main";

export default async function getProblems(
	_request: Request,
	response: Response,
	next: NextFunction,
) {
	try {
		const result: IProblem[] = await db
			.select({
				id: problems.id,
				title: problems.title,
				submissions: submissions.status,
				companies: sql<ICompany[]>`
					COALESCE(
						(
							SELECT JSON_AGG(
								JSONB_BUILD_OBJECT('name', c.name, 'logoUrl', c.logo_url)
								ORDER BY pc.frequency DESC
							)
							FROM problem_companies pc
							INNER JOIN companies c ON c.id = pc.company_id
							WHERE pc.problem_id = ${problems.id}
						),
						'[]'::json
					)
				`,
			})
			.from(problems)
			.leftJoin(submissions, eq(submissions.problemId, problems.id))
			.groupBy(problems.id, problems.title, submissions.status);

		// Limit to top 3 companies for each problem
		const processedResult = result.map(problem => ({
			...problem,
			companies: problem.companies.slice(0, 3)
		}));

		const payload: IResponse<IProblem[]> = {
			status: StatusCodes.OK,
			message: ReasonPhrases.OK,
			data: processedResult,
		};
		return response.status(StatusCodes.OK).json(payload).end();
	} catch (error) {
		next(error);
	}
}

export async function getProblemById(
	request: Request,
	response: Response,
	next: NextFunction,
) {
	try {
		const { id } = request.params;
		const result = await db
			.select({
				id: problems.id,
				title: problems.title,
				bodyMdx: problems.bodyMdx,
				metadata: problems.metadata,
				testCases: sql<ITestCase[]>`
				COALESCE(
					json_agg(
					json_build_object(
						'testCaseId', ${testCases.id},
						'input', ${testCases.input},
						'output', ${testCases.output}
					)
					) FILTER (WHERE ${testCases.id} IS NOT NULL),
					'[]'::json
				)
				`
			})
			.from(problems)
			.leftJoin(testCases, eq(problems.id, testCases.problemId))
			.where(eq(problems.id, id as string))
			.groupBy(problems.id, problems.title, problems.bodyMdx, problems.metadata);

		const payload: IResponse<IProblemById> = {
			status: StatusCodes.OK,
			message: ReasonPhrases.OK,
			data: result[0],
		};
		return response.status(StatusCodes.OK).json(payload).end();
	} catch (error) {
		next(error);
	}
}
