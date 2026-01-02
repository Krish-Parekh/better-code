import { boolean, integer, pgTable, text, timestamp, uuid, unique } from "drizzle-orm/pg-core";
import { problems } from "./problems";

export const testCases = pgTable(
	"test_cases",
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
		isHidden: boolean("is_hidden").notNull().default(false), // Hidden test cases for judging
		order: integer("order").notNull().default(0), // Order for displaying test cases
		createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => [
		unique().on(table.problemId, table.input, table.output),
	],
);
