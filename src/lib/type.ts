import {topics} from "@/db/schema"

export type Topic = typeof topics.$inferSelect;