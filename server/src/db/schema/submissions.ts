import {
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { problems } from "./problems";
import { user } from "./auth";
export const languages = pgEnum("language", ["cpp", "python", "java"]);
export const submissionStatus = pgEnum("submission_status", [
	"PENDING",
	"ACCEPTED",
	"REJECTED",
]);

export const submissions = pgTable("submissions", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
	problemId: uuid("problem_id").references(() => problems.id, {
		onDelete: "cascade",
	}),
	language: languages("language").notNull(),
	code: text("code").notNull(),
	runtime_ms: integer("runtime_ms").notNull(),
	memory_kb: integer("memory_kb").notNull(),
	status: submissionStatus("status").notNull().default("PENDING"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
