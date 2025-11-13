import {
	integer,
	pgTable,
	primaryKey,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { problems } from "./problems";

export const problemCompanies = pgTable(
	"problem_companies",
	{
		problemId: uuid("problem_id").references(() => problems.id, {
			onDelete: "cascade",
		}),
		companyId: uuid("company_id").references(() => companies.id, {
			onDelete: "cascade",
		}),
		frequency: integer("frequency").notNull().default(1),
		lastSeenYear: integer("last_seen_year").notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
	},
	(table) => [primaryKey({ columns: [table.problemId, table.companyId] })],
);
