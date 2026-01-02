import {
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
	check
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { problems } from "./problems";
import { sql } from "drizzle-orm";

export const submissions = pgTable("submissions", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	problemId: uuid("problem_id")
		.notNull()
		.references(() => problems.id, {
			onDelete: "cascade",
		}),
	language: text("language").notNull(),
	code: text("code").notNull(),
	runtimeMs: integer("runtime_ms"),
	memoryKb: integer("memory_kb"),
	status: text("status").notNull().default("PENDING"),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
}, (table) => [
	check("language_check", sql`${table.language} IN ('cpp', 'python', 'javascript')`),
	check("status_check", sql`${table.status} IN ('PENDING', 'ACCEPTED', 'REJECTED')`),
]);
