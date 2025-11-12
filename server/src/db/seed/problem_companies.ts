import db from "../index";
import { problemCompanies } from "../schema/problem_companies";
import { problems } from "../schema/problems";
import { companies } from "../schema/companies";

export async function seedProblemCompanies() {
  console.log("Seeding problem-company relations...");

  // 1. Fetch existing problems and companies
  const allProblems = await db.select({ id: problems.id, title: problems.title }).from(problems);
  const allCompanies = await db.select({ id: companies.id, name: companies.name }).from(companies);

  if (allProblems.length === 0 || allCompanies.length === 0) {
    console.error("No problems or companies found. Run those seeds first.");
    return;
  }

  // 2. Map problem ↔ company associations
  const relations = [
    {
      problemTitle: "Two Sum",
      companyNames: ["Google", "Meta", "Amazon"],
      frequency: 10,
      lastSeenYear: 2025,
    },
    {
      problemTitle: "Maximum Subarray",
      companyNames: ["Adobe", "Atlassian"],
      frequency: 6,
      lastSeenYear: 2024,
    },
    {
      problemTitle: "Subarray Sum Equals K",
      companyNames: ["Google", "American Express"],
      frequency: 4,
      lastSeenYear: 2023,
    },
  ];

  // 3. Build insertable data
  const inserts: {
    problemId: string;
    companyId: string;
    frequency: number;
    lastSeenYear: number;
  }[] = [];

  for (const rel of relations) {
    const problem = allProblems.find((p) => p.title === rel.problemTitle);
    if (!problem) continue;

    for (const companyName of rel.companyNames) {
      const company = allCompanies.find((c) => c.name === companyName);
      if (!company) continue;

      inserts.push({
        problemId: problem.id,
        companyId: company.id,
        frequency: rel.frequency,
        lastSeenYear: rel.lastSeenYear,
      });
    }
  }

  if (inserts.length === 0) {
    console.log("No relations to insert.");
    return;
  }

  // 4. Insert into the join table
  await db.insert(problemCompanies).values(inserts).onConflictDoNothing();

  const inserted = await db.select().from(problemCompanies);

  console.log(`Problem-company relations seeded. Total records: ${inserted.length}`);
}

await seedProblemCompanies();
