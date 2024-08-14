ALTER TABLE "events" RENAME COLUMN "private" TO "published";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_username_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "published_index";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "published_index" ON "events" USING btree ("published");--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "username";