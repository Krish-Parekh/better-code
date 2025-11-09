import type { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import db from "../db";
import { problems } from "../db/schema/problems";
import type { IResponse } from "../types/main";
import { problemCompanies } from "../db/schema/problem_companies";
import { companies } from "../db/schema/companies";
import { eq } from "drizzle-orm";
import type { UUID } from "node:crypto";

async function getAllProblems(_request: Request, response: Response, next: NextFunction) {
    try {
        const allProblemsData = await db.select().from(problems);
        
        const allProblems = allProblemsData.map(problem => ({
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
        
        const problemCompanyData = problemCompanyDataRaw.filter(item => item.problemId);

        const companiesByProblemId = new Map<string, Array<{ name: string; logoUrl: string }>>();
        
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

        const result = allProblems.map(problem => ({
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


export async function getProblemById(request: Request, response: Response, next: NextFunction) {
    try {
        const { id } = request.params;
        const problem = await db.select().from(problems).where(eq(problems.id, id as unknown as UUID));
        const payload: IResponse<typeof problem[0]> = {
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
            data: problem[0] || { id: "", title: "", bodyMdx: "", createdAt: new Date(), updatedAt: new Date() },
        };
        return response.status(StatusCodes.OK).json(payload);
    }
    catch (error) {
        next(error);
    }
}

export { getAllProblems };