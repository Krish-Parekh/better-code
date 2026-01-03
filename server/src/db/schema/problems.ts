import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";
import {
	check,
	jsonb,
	pgTable,
	text,
	timestamp,
	uuid,
	boolean,
} from "drizzle-orm/pg-core";
import { problemCompanies } from "./problem_companies";
import { testCases } from "./testcases";
import { submissions } from "./submissions";

export const problems = pgTable(
	"problems",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		title: text("title").notNull(),
		slug: text("slug").notNull().unique(),
		bodyMdx: text("body_mdx").notNull(),
		difficulty: text("difficulty").notNull(),
		tags: jsonb("tags").notNull().default([]),
		codeSnippets: jsonb("code_snippets").notNull().default({}),
		isPaid: boolean("is_paid").notNull().default(false),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => [
		check(
			"difficulty_check",
			sql`${table.difficulty} IN ('Easy', 'Medium', 'Hard')`,
		),
	],
);

export const problemsRelations = relations(problems, ({ many }) => ({
	problemCompanies: many(problemCompanies),
	testCases: many(testCases),
	submissions: many(submissions),
}));
