ALTER TABLE "problems" ADD COLUMN "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "test_cases" ADD COLUMN "stdin" text NOT NULL;--> statement-breakpoint
ALTER TABLE "test_cases" ADD COLUMN "stdout" text NOT NULL;