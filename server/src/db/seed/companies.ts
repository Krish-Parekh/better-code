import db from "..";
import { companies } from "../schema/companies";

const dummyCompanies = [
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
	}, // fixed typos
];

async function seedCompanies() {
	console.log("Seeding companies...");
	await db
		.insert(companies)
		.values(dummyCompanies)
		.onConflictDoNothing({ target: companies.slug });

	const inserted = await db.select({ slug: companies.slug }).from(companies);

	console.log(`Companies in DB: ${inserted.length}`);
}

await seedCompanies();
