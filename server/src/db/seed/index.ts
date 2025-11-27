import seedCompanies from "./companies";


async function seed() {
    try {
        console.log("Seeding database...");
        await seedCompanies();
        console.log("Database seeded successfully");
    } catch (error) {
        console.error("Error seeding database:", error);
        throw error;
    }
}

await seed();