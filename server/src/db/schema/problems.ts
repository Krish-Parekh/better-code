import { jsonb, pgTable, text, timestamp, uuid, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const problems = pgTable("problems", {
	id: uuid("id").primaryKey().defaultRandom(),
	title: text("title").notNull(),
	slug: text("slug").notNull().unique(),
	bodyMdx: text("body_mdx").notNull(),
	difficulty: text("difficulty").notNull(),
	tags: jsonb("tags").notNull().default([]), 
	codeSnippets: jsonb("code_snippets").notNull().default({}),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
}, (table) => [
	check("difficulty_check", sql`${table.difficulty} IN ('Easy', 'Medium', 'Hard')`),
]);
