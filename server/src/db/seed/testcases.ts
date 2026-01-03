import db from "..";
import { testCasesData } from "../data/testcases";
import { problems, testCases } from "../schema";

export default async function seedTestCases() {
	try {
		console.info("Seeding test cases...");

		const allProblems = await db
			.select({ id: problems.id, slug: problems.slug })
			.from(problems);

		const problemMap = new Map(allProblems.map((p) => [p.slug, p.id]));

		const values = Object.entries(testCasesData).flatMap(
			([problemSlug, cases]) =>
				cases
					.map((testCase, caseIndex) => ({
						problemId: problemMap.get(problemSlug),
						stdin: testCase.stdin,
						stdout: testCase.stdout,
						input: testCase.input,
						output: testCase.output,
						bodyMdx: testCase.bodyMdx,
						isHidden: false,
						order: caseIndex,
					}))
					.filter(
						(
							tc,
						): tc is {
							problemId: string;
							stdin: string;
							stdout: string;
							input: string;
							output: string;
							bodyMdx: string;
							isHidden: boolean;
							order: number;
						} => !!tc.problemId,
					),
		);

		await db.insert(testCases).values(values).onConflictDoNothing();
		console.info("Test cases seeded successfully");
	} catch (error) {
		console.error("Error seeding test cases:", error);
		throw error;
	}
}

await seedTestCases();