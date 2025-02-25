import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const doubts = pgTable("doubts", {
  id: serial("id").primaryKey(),
  user_id: varchar("user_id", { length: 255 }).notNull(),
  content: varchar("content", { length: 255 }).notNull(),
  date_time: timestamp("date_time").defaultNow(),
  right_count: integer("right_count").default(0),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
});
