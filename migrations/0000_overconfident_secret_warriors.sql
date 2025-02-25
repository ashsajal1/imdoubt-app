CREATE TABLE IF NOT EXISTS "doubts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"date_time" timestamp DEFAULT now(),
	"right_count" integer DEFAULT 0,
	"updated_at" timestamp DEFAULT now()
);
