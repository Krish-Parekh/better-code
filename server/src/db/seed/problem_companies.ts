import db from "..";
import { problemsCompaniesData } from "../data/problems_companies";
import { companies, problemCompanies, problems } from "../schema";

export default async function seedProblemCompanies() {
	try {
		console.info("Seeding problem companies...");

		const [allProblems, allCompanies] = await Promise.all([
			db.select({ id: problems.id, slug: problems.slug }).from(problems),
			db.select({ id: companies.id, slug: companies.slug }).from(companies),
		]);

		const problemMap = new Map(allProblems.map((p) => [p.slug, p.id]));
		const companyMap = new Map(allCompanies.map((c) => [c.slug, c.id]));

		const values = Object.entries(problemsCompaniesData).flatMap(
			([problemSlug, companies]) =>
				companies
					.map(({ companySlug, frequency, lastSeenYear }) => ({
						problemId: problemMap.get(problemSlug),
						companyId: companyMap.get(companySlug),
						frequency,
						lastSeenYear,
					}))
					.filter(
						(
							p,
						): p is {
							problemId: string;
							companyId: string;
							frequency: number;
							lastSeenYear: number;
						} => !!p.problemId && !!p.companyId,
					),
		);

		await db.insert(problemCompanies).values(values).onConflictDoNothing();
		console.info("Problem companies seeded successfully");
	} catch (error) {
		console.error("Error seeding problem companies:", error);
		throw error;
	}
}
