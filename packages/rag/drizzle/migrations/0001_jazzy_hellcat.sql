ALTER TABLE "documents" RENAME COLUMN "created_at" TO "updated_at";--> statement-breakpoint
ALTER TABLE "resources" DROP COLUMN "created_at";