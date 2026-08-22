import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Every validated enquiry submitted through /api/contact.
 * Persisted first so a lead is never lost when notification delivery fails.
 */
export const leads = sqliteTable("leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  budget: text("budget").notNull(),
  website: text("website").notNull().default(""),
  details: text("details").notNull().default(""),
  source: text("source").notNull().default("upstack-website"),
  notifiedAt: text("notified_at"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
