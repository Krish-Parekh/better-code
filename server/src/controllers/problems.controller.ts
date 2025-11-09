import type { UUID } from "node:crypto";
import { eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import db from "../db";
import { companies } from "../db/schema/companies";
import { problemCompanies } from "../db/schema/problem_companies";
import { problems } from "../db/schema/problems";
import { testCases } from "../db/schema/test_cases";
import type { IResponse } from "../types/main";

async function getAllProblems(
	_request: Request,
	response: Response,
	next: NextFunction,
) {
	try {
		const allProblemsData = await db.select().from(problems);

		const allProblems = allProblemsData.map((problem) => ({
			id: problem.id,
			title: problem.title,
		}));

		const problemCompanyDataRaw = await db
			.select({
				problemId: problemCompanies.problemId,
				companyName: companies.name,
				companyLogoUrl: companies.logoUrl,
			})
			.from(problemCompanies)
			.innerJoin(companies, eq(problemCompanies.companyId, companies.id));

		const problemCompanyData = problemCompanyDataRaw.filter(
			(item) => item.problemId,
		);

		const companiesByProblemId = new Map<
			string,
			Array<{ name: string; logoUrl: string }>
		>();

		for (const item of problemCompanyData) {
			if (!item.problemId) continue;

			if (!companiesByProblemId.has(item.problemId)) {
				companiesByProblemId.set(item.problemId, []);
			}

			companiesByProblemId.get(item.problemId)!.push({
				name: item.companyName,
				logoUrl: item.companyLogoUrl,
			});
		}

		const result = allProblems.map((problem) => ({
			id: problem.id,
			title: problem.title,
			companies: companiesByProblemId.get(problem.id) || [],
		}));

		const payload: IResponse<typeof result> = {
			status: StatusCodes.OK,
			message: ReasonPhrases.OK,
			data: result,
		};
		return response.status(StatusCodes.OK).json(payload);
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
		const problemWithTestCases = await db
			.select({
				id: problems.id,
				title: problems.title,
				bodyMdx: problems.bodyMdx,
				createdAt: problems.createdAt,
				updatedAt: problems.updatedAt,
				testCaseId: testCases.id,
				testCaseInput: testCases.input,
				testCaseOutput: testCases.output,
			})
			.from(problems)
			.leftJoin(testCases, eq(problems.id, testCases.problemId))
			.where(eq(problems.id, id as unknown as UUID));

		const problem = problemWithTestCases[0];
		const testCasesData = problemWithTestCases
			.filter((row) => row.testCaseId)
			.map((row) => ({
				id: row.testCaseId,
				input: row.testCaseInput,
				output: row.testCaseOutput,
			}));

		const result = {
			id: problem?.id,
			title: problem?.title,
			bodyMdx: problem?.bodyMdx,
			createdAt: problem?.createdAt,
			updatedAt: problem?.updatedAt,
			testCases: testCasesData,
		};

		const payload: IResponse<typeof result> = {
			status: StatusCodes.OK,
			message: ReasonPhrases.OK,
			data: result,
		};
		return response.status(StatusCodes.OK).json(payload);
	} catch (error) {
		next(error);
	}
}

export { getAllProblems };
