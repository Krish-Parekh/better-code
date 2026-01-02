import { sql } from "drizzle-orm";
import db from "..";
import { companies } from "../schema/companies";

const companyData = [
	{
		name: "Google",
		slug: "google",
		logoUrl: "https://cdn.svglogos.dev/logos/google-icon.svg",
	},
	{
		name: "Meta",
		slug: "meta",
		logoUrl: "https://cdn.svglogos.dev/logos/meta-icon.svg",
	},
	{
		name: "Adobe",
		slug: "adobe",
		logoUrl: "https://cdn.svglogos.dev/logos/adobe.svg",
	},
	{
		name: "American Express",
		slug: "american-express",
		logoUrl: "https://cdn.svglogos.dev/logos/amex-digital.svg",
	},
	{
		name: "Atlassian",
		slug: "atlassian",
		logoUrl: "https://cdn.svglogos.dev/logos/atlassian.svg",
	},
	{
		name: "LinkedIn",
		slug: "linkedin",
		logoUrl: "https://cdn.svglogos.dev/logos/linkedin-icon.svg",
	},
];

export default async function seedCompanies() {
	try {
		console.log("Seeding companies...");
		const result = await db
			.insert(companies)
			.values(companyData)
			.onConflictDoUpdate({
				target: [companies.slug],
				set: {
					updatedAt: sql`now()`,
				},
			});
		console.log(`Seeded ${result.rowCount} companies`);
	} catch (error) {
		console.error("Error seeding companies:", error);
		throw error;
	}
}
