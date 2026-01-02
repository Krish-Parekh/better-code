import db from "..";
import { companies } from "../schema";
import { companiesData } from "../data/companies";

export default async function seedCompanies() {
	try {
		console.info("Seeding companies...");
		await db.insert(companies).values(companiesData).onConflictDoNothing();
		console.info("Companies seeded successfully");
	} catch (error) {
		console.error("Error seeding companies:", error);
		throw error;
	}
}
