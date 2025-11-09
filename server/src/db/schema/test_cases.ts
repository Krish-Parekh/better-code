import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { problems } from "./problems";

export const testCases = pgTable("test_cases", {
	id: uuid("id").primaryKey().defaultRandom(),
	problemId: uuid("problem_id").references(() => problems.id, {
		onDelete: "cascade",
	}),
	input: text("input").notNull(),
	output: text("output").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
