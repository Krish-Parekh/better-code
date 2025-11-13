import {
	maximumSubarrayMdx,
	maximumSubarrayTemplates,
	subarraySumMdx,
	subarraySumTemplates,
	twoSumMdx,
	twoSumTemplates,
} from "../../data";
import db from "../index";
import { problems } from "../schema/problems";

const dummyProblems = [
	{
		title: "Two Sum",
		bodyMdx: twoSumMdx,
		metadata: { templates: twoSumTemplates },
	},
	{
		title: "Subarray Sum Equals K",
		bodyMdx: subarraySumMdx,
		metadata: { templates: subarraySumTemplates },
	},
	{
		title: "Maximum Subarray",
		bodyMdx: maximumSubarrayMdx,
		metadata: { templates: maximumSubarrayTemplates },
	},
];

export async function seedProblems() {
	console.log("Seeding array/subarray problems...");

	try {
		await db
			.insert(problems)
			.values(dummyProblems as any)
			.onConflictDoNothing();

		const inserted = await db.select({ title: problems.title }).from(problems);

		console.log(`Problems seeded successfully. Total: ${inserted.length}`);
	} catch (error) {
		console.error("Error seeding problems:", error);
	}
}

await seedProblems();
