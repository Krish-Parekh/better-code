import db from "..";
import problemsData from "../data/problems";
import { problems } from "../schema";

export default async function seedProblems() {
	try {
		console.info("Seeding problems...");
		await db.insert(problems).values(problemsData).onConflictDoNothing();
		console.info("Problems seeded successfully");
	} catch (error) {
		console.error("Error seeding problems:", error);
		throw error;
	}
}
