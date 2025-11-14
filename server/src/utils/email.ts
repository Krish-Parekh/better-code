import { Resend } from "resend";

export class EmailService {
	private readonly resend: Resend;

	constructor() {
		this.resend = new Resend(process.env.RESEND_API_KEY!);
	}

	async sendVerificationEmail(email: string, url: string) {
		await this.resend.emails.send({
			from: process.env.RESEND_FROM_EMAIL!,
			to: email,
			subject: "Verify your email address",
			text: `Click the link to verify your email: ${url}`,
		});
	}

	async sendResetPasswordEmail(email: string, url: string) {
		await this.resend.emails.send({
			from: process.env.RESEND_FROM_EMAIL!,
			to: email,
			subject: "Reset your password",
			text: `Click the link to reset your password: ${url}`,
		});
	}

	async sendPasswordResetSuccessEmail(email: string) {
		await this.resend.emails.send({
			from: process.env.RESEND_FROM_EMAIL!,
			to: email,
			subject: "Password reset successful",
			text: "Your password has been reset successfully",
		});
	}
}
