const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");
class Email {
	constructor(user, url) {
		this.user = user;
		this.name = user.name;
		this.url = url;
		this.from = "Alkady <natours@natours.com>";
		this.to = user.email;
	}

	createTransport() {

		// SendGrid
		// return nodemailer.createTransport({
		// 	service:"SendGrid",
		// 	auth: {
		// 		user: process.env.EMAIL_USERNAME,
		// 		pass: process.env.EMAIL_PASSWORD,
		// 	},
		// });


		return nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PROT,
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD,
			},
		});
	}

	async send(template, subject) {
		const html = pug.renderFile(
			`${__dirname}/../views/emails/${template}.pug`,
			{
				name: this.name,
				url: this.url,
				subject,
			}
		);
		const text = htmlToText.convert(html);
		const emailOptions = {
			from: this.from,
			to: this.to,
			subject,
			html: html,
			text: text,
		};

		await this.createTransport().sendMail(emailOptions);
	}

	async sendWelcome() {
		await this.send("welcome", "Welcome To Natours Family");
	}
	async sendResetPassword() {
		await this.send(
			"resetPassword",
			"Your password reset link (valid for 10 minutes)"
		);
	}
}

module.exports = Email;
