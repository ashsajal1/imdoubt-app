// schema.ts
import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const doubts = pgTable("doubts", {
  id: serial("id").primaryKey(), // Auto-incrementing primary key
  user_id: integer("user_id").notNull(), // User ID to associate with the doubt
  date_time: timestamp("date_time").defaultNow(), // Date and time the doubt was created
  right_count: integer("right_count").default(0), // Count of correct answers or interactions
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`), // Automatically update on modification
});
