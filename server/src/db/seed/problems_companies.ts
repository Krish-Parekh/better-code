import { sql } from "drizzle-orm";
import db from "..";
import { companies } from "../schema/companies";
import { problemCompanies } from "../schema/problem_companies";
import { problems } from "../schema/problems";

const problemCompanyMappings: Record<
	string,
	Array<{ companySlug: string; frequency: number; lastSeenYear: number }>
> = {
	"Two Sum": [
		{ companySlug: "google", frequency: 5, lastSeenYear: 2024 },
		{ companySlug: "meta", frequency: 4, lastSeenYear: 2024 },
		{ companySlug: "adobe", frequency: 3, lastSeenYear: 2023 },
		{ companySlug: "american-express", frequency: 2, lastSeenYear: 2023 },
		{ companySlug: "atlassian", frequency: 2, lastSeenYear: 2024 },
		{ companySlug: "linkedin", frequency: 3, lastSeenYear: 2024 },
	],
	"Maximum Subarray Sum": [
		{ companySlug: "google", frequency: 4, lastSeenYear: 2024 },
		{ companySlug: "meta", frequency: 3, lastSeenYear: 2024 },
		{ companySlug: "linkedin", frequency: 2, lastSeenYear: 2023 },
		{ companySlug: "adobe", frequency: 2, lastSeenYear: 2023 },
	],
	"Subarray Sum Equals K": [
		{ companySlug: "google", frequency: 3, lastSeenYear: 2024 },
		{ companySlug: "meta", frequency: 3, lastSeenYear: 2024 },
		{ companySlug: "adobe", frequency: 2, lastSeenYear: 2023 },
		{ companySlug: "linkedin", frequency: 2, lastSeenYear: 2024 },
	],
};

export default async function seedProblemCompanies() {
	try {
		console.log("Seeding problem companies...");

		// Get all problems
		const allProblems = await db.select().from(problems);
		const problemsMap = new Map(allProblems.map((p) => [p.title, p]));

		// Get all companies
		const allCompanies = await db.select().from(companies);
		const companiesMap = new Map(allCompanies.map((c) => [c.slug, c]));

		let seededCount = 0;

		// Process each problem-company mapping
		for (const [problemTitle, companyMappings] of Object.entries(
			problemCompanyMappings,
		)) {
			const problem = problemsMap.get(problemTitle);
			if (!problem) {
				console.warn(`Problem "${problemTitle}" not found, skipping...`);
				continue;
			}

			for (const mapping of companyMappings) {
				const company = companiesMap.get(mapping.companySlug);
				if (!company) {
					console.warn(
						`Company "${mapping.companySlug}" not found, skipping...`,
					);
					continue;
				}

				try {
					await db
						.insert(problemCompanies)
						.values({
							problemId: problem.id,
							companyId: company.id,
							frequency: mapping.frequency,
							lastSeenYear: mapping.lastSeenYear,
						})
						.onConflictDoUpdate({
							target: [problemCompanies.problemId, problemCompanies.companyId],
							set: {
								frequency: mapping.frequency,
								lastSeenYear: mapping.lastSeenYear,
								updatedAt: sql`now()`,
							},
						});
					seededCount++;
				} catch (error) {
					console.error(
						`Error seeding problem-company association: ${problemTitle} - ${mapping.companySlug}`,
						error,
					);
					throw error;
				}
			}
		}

		console.log(`Seeded ${seededCount} problem-company associations`);
	} catch (error) {
		console.error("Error seeding problem companies:", error);
		throw error;
	}
}
