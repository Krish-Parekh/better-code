import seedCompanies from "./companies";
import seedProblems from "./problems";

async function seed() {
    try {
        console.log("Seeding database...");
        await seedCompanies();
        await seedProblems();
        console.log("Database seeded successfully");
    } catch (error) {
        console.error("Error seeding database:", error);
        throw error;
    }
}

await seed();