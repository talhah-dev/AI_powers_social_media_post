import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const post = pgTable("post", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  platform: text("platform").notNull().default("instagram"),
  postType: text("post_type").notNull().default("feed"),
  content: text("content").notNull().default(""),
  mediaUrl: text("media_url"),
  publishNow: boolean("publish_now").notNull().default(true),
  scheduledFor: timestamp("scheduled_for"),
  status: text("status").notNull().default("scheduled"),
  zernioPostId: text("zernio_post_id"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const postRelations = relations(post, ({ one }) => ({
  author: one(user, {
    fields: [post.userId],
    references: [user.id],
  }),
}));
