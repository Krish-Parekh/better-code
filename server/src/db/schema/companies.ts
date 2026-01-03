import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { problemCompanies } from "./problem_companies";

export const companies = pgTable("companies", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	slug: text("slug").notNull().unique(),
	logoUrl: text("logo_url").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const companiesRelations = relations(companies, ({ many }) => ({
	problemCompanies: many(problemCompanies),
}));
