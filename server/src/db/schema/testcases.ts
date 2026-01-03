import { relations } from "drizzle-orm";
import {
	boolean,
	integer,
	pgTable,
	text,
	timestamp,
	unique,
	uuid,
} from "drizzle-orm/pg-core";
import { problems } from "./problems";

export const testCases = pgTable(
	"testcases",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		problemId: uuid("problem_id")
			.notNull()
			.references(() => problems.id, {
				onDelete: "cascade",
			}),
		stdin: text("stdin").notNull(),
		stdout: text("stdout").notNull(),
		input: text("input").notNull(),
		output: text("output").notNull(),
		bodyMdx: text("body_mdx").notNull(),
		isHidden: boolean("is_hidden").notNull().default(false),
		order: integer("order").notNull().default(0),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => [unique().on(table.problemId, table.input, table.output)],
);

export const testCasesRelations = relations(testCases, ({ one }) => ({
	problem: one(problems, {
		fields: [testCases.problemId],
		references: [problems.id],
	}),
}));
