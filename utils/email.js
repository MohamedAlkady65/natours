const nodemailer = require("nodemailer");

exports.sendEmail = async (options) => {
	const transportOptions = {
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PROT,
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD,
		},
	};

	const transport = nodemailer.createTransport(transportOptions);

	const emailOptions = {
		from: "Natours <natours@natours.com>",
		to: options.email,
		subject: options.subject,
		text: options.text,
	};


	await transport.sendMail(emailOptions);
};
