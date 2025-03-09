import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  unique,
  boolean,
  text,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Define the topics table
export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
});

// Define the doubts table
export const doubts = pgTable("doubts", {
  id: serial("id").primaryKey(),
  user_id: varchar("user_id", { length: 255 }).notNull(),
  content: varchar("content", { length: 255 }).notNull(),
  date_time: timestamp("date_time").defaultNow(),
  right_count: integer("right_count").default(0),
  wrong_count: integer("wrong_count").default(0),
  topic_id: integer("topic_id")
    .references(() => topics.id, { onDelete: "cascade" }),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
});

// Define the doubtReactions table
export const doubtReactions = pgTable(
  "doubt_reactions",
  {
    id: serial("id").primaryKey(),
    doubt_id: integer("doubt_id")
      .notNull()
      .references(() => doubts.id, { onDelete: "cascade" }),
    user_id: varchar("user_id", { length: 255 }).notNull(),
    is_right: boolean("is_right").notNull(), // true for right, false for wrong
    created_at: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    // Ensure one user can only have one reaction per doubt
    userDoubtConstraint: unique().on(table.doubt_id, table.user_id),
  })
);

// Define the perspectives table
export const perspectives = pgTable("perspectives", {
  id: serial("id").primaryKey(),
  doubt_id: integer("doubt_id")
    .notNull()
    .references(() => doubts.id, { onDelete: "cascade" }),
  user_id: varchar("user_id", { length: 255 }).notNull(),
  content: text("content").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
});

// Helper function to get doubt with reaction counts
export const getDoubtWithReactions = (db: any) => {
  return db
    .select({
      id: doubts.id,
      content: doubts.content,
      user_id: doubts.user_id,
      date_time: doubts.date_time,
      right_count: sql`COUNT(CASE WHEN ${doubtReactions.is_right} = true THEN 1 END)`,
      wrong_count: sql`COUNT(CASE WHEN ${doubtReactions.is_right} = false THEN 1 END)`,
    })
    .from(doubts)
    .leftJoin(doubtReactions, sql`${doubts.id} = ${doubtReactions.doubt_id}`)
    .groupBy(doubts.id);
};
