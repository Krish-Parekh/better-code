import { relations } from "drizzle-orm";
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
		problemId: uuid("problem_id")
			.notNull()
			.references(() => problems.id, {
				onDelete: "cascade",
			}),
		companyId: uuid("company_id")
			.notNull()
			.references(() => companies.id, {
				onDelete: "cascade",
			}),
		frequency: integer("frequency").notNull().default(1),
		lastSeenYear: integer("last_seen_year").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => [primaryKey({ columns: [table.problemId, table.companyId] })],
);

export const problemCompaniesRelations = relations(
	problemCompanies,
	({ one }) => ({
		problem: one(problems, {
			fields: [problemCompanies.problemId],
			references: [problems.id],
		}),
		company: one(companies, {
			fields: [problemCompanies.companyId],
			references: [companies.id],
		}),
	}),
);
