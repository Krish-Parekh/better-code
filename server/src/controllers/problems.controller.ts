import { eq, sql } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import db from "../db";
import { companies } from "../db/schema/companies";
import { problemCompanies } from "../db/schema/problem_companies";
import { problems } from "../db/schema/problems";
import { submissions } from "../db/schema/submissions";
import type { ICompany, IProblem, IResponse } from "../types/main";

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
				companies: sql<ICompany[]>`COALESCE(
				JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('name', ${companies.name}, 'logoUrl', ${companies.logoUrl}))
				FILTER (WHERE ${companies.id} IS NOT NULL),
				'[]'
				)`,
			})
			.from(problems)
			.leftJoin(problemCompanies, eq(problemCompanies.problemId, problems.id))
			.leftJoin(companies, eq(companies.id, problemCompanies.companyId))
			.leftJoin(submissions, eq(submissions.problemId, problems.id))
			.groupBy(problems.id, problems.title, submissions.status);

		const payload: IResponse<IProblem[]> = {
			status: StatusCodes.OK,
			message: ReasonPhrases.OK,
			data: result,
		};
		return response.status(StatusCodes.OK).json(payload).end();
	} catch (error) {
		next(error);
	}
}
