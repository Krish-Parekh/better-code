import { eq, sql } from "drizzle-orm";
import db from "..";
import { problems } from "../schema/problems";
import { testCases } from "../schema/test_cases";

const dummyTestCases: Record<
	string,
	Array<{
		input: string;
		output: string;
		stdin?: string;
		stdout?: string;
		bodyMdx: string;
	}>
> = {
	"Maximum Subarray": [
		{
			input: "[-2,1,-3,4,-1,2,1,-5,4]",
			output: "6",
			stdin: "9\n-2 1 -3 4 -1 2 1 -5 4",
			stdout: "6",
			bodyMdx: "arr = [-2,1,-3,4,-1,2,1,-5,4]",
		},
		{
			input: "[1]",
			output: "1",
			stdin: "1\n1",
			stdout: "1",
			bodyMdx: "arr = [1]",
		},
		{
			input: "[5,4,-1,7,8]",
			output: "23",
			stdin: "5\n5 4 -1 7 8",
			stdout: "23",
			bodyMdx: "arr = [5,4,-1,7,8]",
		},
	],
	"Subarray Sum Equals K": [
		{
			input: "[1,1,1], k=2",
			output: "2",
			stdin: "3\n1 1 1\n2",
			stdout: "2",
			bodyMdx: "arr = [1,1,1]\nk = 2",
		},
		{
			input: "[1,2,3], k=3",
			output: "2",
			stdin: "3\n1 2 3\n3",
			stdout: "2",
			bodyMdx: "arr = [1,2,3]\nk = 3",
		},
		{
			input: "[1,2,1,2,1], k=3",
			output: "4",
			stdin: "5\n1 2 1 2 1\n3",
			stdout: "4",
			bodyMdx: "arr = [1,2,1,2,1]\nk = 3",
		},
	],
	"Two Sum": [
		{
			input: "[2,7,11,15], target=9",
			output: "[0,1]",
			stdin: "4\n2 7 11 15\n9",
			stdout: "[0,1]",
			bodyMdx: "arr = [2,7,11,15]\ntarget = 9",
		},
		{
			input: "[3,2,4], target=6",
			output: "[1,2]",
			stdin: "3\n3 2 4\n6",
			stdout: "[1,2]",
			bodyMdx: "arr = [3,2,4]\ntarget = 6",
		},
		{
			input: "[3,3], target=6",
			output: "[0,1]",
			stdin: "2\n3 3\n6",
			stdout: "[0,1]",
			bodyMdx: "arr = [3,3]\ntarget = 6",
		},
	],
};

async function seedTestCases() {
	console.log("Seeding test cases...");
	for (const [slug, cases] of Object.entries(dummyTestCases)) {
		const [problem] = await db
			.select({ id: problems.id })
			.from(problems)
			.where(eq(problems.title, slug));
		if (!problem) {
			console.warn(`Problem not found: ${slug}`);
			continue;
		}

		const rows = cases.map((c) => ({
			problemId: problem.id,
			input: c.input,
			output: c.output,
			stdin: c.stdin || "",
			stdout: c.stdout || "",
			bodyMdx: c.bodyMdx,
		}));

		await db.insert(testCases).values(rows).onConflictDoNothing();
		console.log(`Seeded ${rows.length} test cases for problem: ${slug}`);
	}

	const total = await db.select({ id: testCases.id }).from(testCases);
	console.log(`Total test cases in DB: ${total.length}`);
}

await seedTestCases();
