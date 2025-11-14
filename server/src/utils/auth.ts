import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "../db";
import { account, session, user } from "../db/schema/auth";
import { EmailService } from "./email";

const emailService = new EmailService();
export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			user: user,
			session: session,
			account: account,
		},
	}),
	secret: process.env.BETTER_AUTH_SECRET!,
	url: process.env.BETTER_AUTH_URL!,
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		sendResetPassword: async ({ user, url, token }, request) => {
			console.log(user, url, token, request);
		},
		onPasswordReset: async ({ user }, request) => {
			console.log(`Password for user ${user.email} has been reset. ${request}`);
		},
	},
	emailVerification: {
		sendVerificationEmail: async ({ user, url }) => {
			await emailService.sendVerificationEmail(user.email, url);
		},
	},
});
