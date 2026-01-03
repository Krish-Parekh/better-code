import type { User } from "better-auth/types";

export type SubmissionStatus =
	| "PENDING"
	| "ACCEPTED"
	| "REJECTED"
	| "NOT_SUBMITTED";

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
	slug: string;
	isPaid: boolean;
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
	metadata: {
		templates: {
			python: string;
			javascript: string;
			java: string;
		};
	};
	testCases: Array<{
		testCaseId: string;
		input: string;
		output: string;
	}>;
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
