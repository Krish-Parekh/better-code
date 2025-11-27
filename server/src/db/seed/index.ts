import seedCompanies from "./companies";
import seedProblems from "./problems";
import seedProblemCompanies from "./problems_companies";
import seedTestCases from "./test_cases";

async function seed() {
    try {
        console.log("Seeding database...");
        await seedCompanies();
        await seedProblems();
        await seedProblemCompanies();
        await seedTestCases();
        console.log("Database seeded successfully");
    } catch (error) {
        console.error("Error seeding database:", error);
        throw error;
    }
}

await seed();