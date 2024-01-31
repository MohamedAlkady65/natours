const crypto = require("crypto");

exports.hashToken = async (token) =>
	await crypto.createHash("sha256").update(token).digest("hex");

exports.getToken = async () => (await crypto.randomBytes(32)).toString("hex");
