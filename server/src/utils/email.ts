import { Resend } from "resend";

export class EmailService {
	private readonly resend: Resend;

	constructor() {
		this.resend = new Resend(process.env.RESEND_API_KEY!);
	}

	async sendVerificationEmail(email: string, url: string) {
		await this.resend.emails.send({
			from: "Better Code <emails@admin.krishparekhdev.com>",
			to: email,
			subject: "Verify your email address",
			text: `Click the link to verify your email: ${url}`,
		});
	}
}
