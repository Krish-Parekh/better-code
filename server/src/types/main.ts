import type { User } from "better-auth/types";
import type { SubmissionStatus } from "../db/schema/submissions";
export interface IResponse<T> {
	status: number;
	message: string;
	data?: T;
}

export interface ICompany {
	name: string;
	logoUrl: string;
}

export interface IProblem {
	id: string;
	title: string;
	submissions: SubmissionStatus | null;
	companies: ICompany[];
}

export interface ITestCase {
	id: string;
	stdin: string;
	stdout: string;
	input: string;
	output: string;
	bodyMdx: string;
}
export interface IProblemById {
	id: string;
	title: string;
	bodyMdx: string;
	metadata: unknown;
	testCases: ITestCase[];

}
declare module "express-serve-static-core" {
	interface Request {
		user?: User;
	}
}
export interface ILanguage {
	python: string;
	javascript: string;
}