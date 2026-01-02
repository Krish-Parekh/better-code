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
