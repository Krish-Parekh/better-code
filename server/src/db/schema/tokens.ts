import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const tokens = pgTable("tokens", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
	token: text("token").notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
	revokedAt: timestamp("revoked_at", { withTimezone: true }),
	replacedBy: uuid("replaced_by").references((): any => tokens.id, {
		onDelete: "set null",
	}),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});
