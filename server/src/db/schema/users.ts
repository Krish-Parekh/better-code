import { pgTable, uuid, varchar, timestamp, pgEnum, jsonb } from "drizzle-orm/pg-core";

export const plan = pgEnum("plan", ["FREE", "PRO", "ENTERPRISE"]);
export const subscriptionStatus = pgEnum("subscription_status", ["ACTIVE", "CANCELED", "EXPIRED"]);

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    username: varchar("username", { length: 255 }).notNull(),
    email: varchar("email", { length: 500 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    plan: plan("plan").notNull().default("FREE"),
    subscriptionStatus: subscriptionStatus("subscription_status").notNull().default("ACTIVE"),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});