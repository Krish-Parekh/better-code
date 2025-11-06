ALTER TABLE "tokens" DROP CONSTRAINT "tokens_replaced_by_tokens_id_fk";
--> statement-breakpoint
ALTER TABLE "tokens" DROP COLUMN "replaced_by";