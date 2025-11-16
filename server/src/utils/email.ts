import ejs from "ejs";
import { join } from "path";
import { Resend } from "resend";

export class EmailService {
	private readonly resend: Resend;
	private readonly viewsPath: string;

	constructor() {
		this.resend = new Resend(process.env.RESEND_API_KEY!);
		this.viewsPath = join(process.cwd(), "src", "templates");
	}

	private renderTemplate(
		templateName: string,
		data: Record<string, string | number>,
	): Promise<string> {
		return new Promise((resolve, reject) => {
			ejs.renderFile(join(this.viewsPath, templateName), data, (err, html) => {
				if (err) {
					reject(err);
				} else {
					resolve(html);
				}
			});
		});
	}

	async sendVerificationEmail(email: string, url: string, username?: string) {
		const token = url.split("token=")[1]?.split("&")[0];
		const callbackURL = url.split("callbackURL=")[1];
		const verificationLink = `${process.env.BETTER_AUTH_URL!}/verify-email?token=${token}&callbackURL=${callbackURL}`;
		const html = await this.renderTemplate("verification-email.ejs", {
			username: username || "there",
			email,
			verificationLink,
			currentYear: new Date().getFullYear(),
		});

		await this.resend.emails.send({
			from: process.env.RESEND_FROM_EMAIL!,
			to: email,
			subject: "Verify your email address - better code",
			html,
			text: `Hello ${username || "there"}, please verify your email by clicking this link: ${verificationLink}`,
		});
	}

	async sendResetPasswordEmail(email: string, url: string, username?: string) {
		const html = await this.renderTemplate("reset-password-email.ejs", {
			username: username || "there",
			email,
			resetPasswordLink: url,
			currentYear: new Date().getFullYear(),
		});

		await this.resend.emails.send({
			from: process.env.RESEND_FROM_EMAIL!,
			to: email,
			subject: "Reset your password - better code",
			html,
			text: `Hello ${username || "there"}, click this link to reset your password: ${url}`,
		});
	}

	async sendPasswordResetSuccessEmail(email: string, username?: string) {
		const html = await this.renderTemplate("success-reset-password-email.ejs", {
			username: username || "there",
			email,
			currentYear: new Date().getFullYear(),
		});

		await this.resend.emails.send({
			from: process.env.RESEND_FROM_EMAIL!,
			to: email,
			subject: "Password reset successful - better code",
			html,
			text: `Hello ${username || "there"}, your password has been successfully reset.`,
		});
	}
}
