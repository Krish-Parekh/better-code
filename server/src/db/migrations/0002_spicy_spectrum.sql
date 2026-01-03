ALTER TABLE "test_cases" RENAME TO "testcases";--> statement-breakpoint
ALTER TABLE "testcases" DROP CONSTRAINT "test_cases_problem_id_input_output_unique";--> statement-breakpoint
ALTER TABLE "testcases" DROP CONSTRAINT "test_cases_problem_id_problems_id_fk";
--> statement-breakpoint
ALTER TABLE "testcases" ADD CONSTRAINT "testcases_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testcases" ADD CONSTRAINT "testcases_problem_id_input_output_unique" UNIQUE("problem_id","input","output");