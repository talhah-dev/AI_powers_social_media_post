import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("user"),
  approval: text("approval").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
