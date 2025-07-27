ALTER TABLE "users" ADD COLUMN "verification_code" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_verified" boolean DEFAULT false NOT NULL;