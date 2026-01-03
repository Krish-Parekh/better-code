export type SubmissionStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "NOT_SUBMITTED";

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

export interface IResponse<T> {
	status: number;
	message: string;
	data?: T;
}

export interface ITestCase {
	testCaseId: string;
	input: string;
	output: string;
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
	testCases: ITestCase[];
}
