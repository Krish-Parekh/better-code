import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { problems } from "./problems";

export const testCases = pgTable("test_cases", {
	id: uuid("id").primaryKey().defaultRandom(),
	problemId: uuid("problem_id").references(() => problems.id, {
		onDelete: "cascade",
	}),
	stdin: text("stdin").notNull(),
	stdout: text("stdout").notNull(),
	input: text("input").notNull(),
	output: text("output").notNull(),
	bodyMdx: text("body_mdx").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
	uniqueTest: [table.problemId, table.input, table.output],
}));
