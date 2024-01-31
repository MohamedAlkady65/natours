const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { hashToken, getToken } = require("../utils/encrypt");

const handlePassword = async (doc) => {
	if (!doc.isModified("password")) return;

	doc.password = await bcrypt.hash(doc.password, 10);

	doc.passwordConfirm = undefined;
};

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "User name is required"],
	},
	email: {
		type: String,
		required: [true, "User email address is required"],
		unique: [true, "Email address is already used"],
		lowercase: true,
		validate: [
			validator.default.isEmail,
			"Please provide valid email address",
		],
	},
	password: {
		type: String,
		required: [true, "User password is required"],
		select: false,
	},
	passwordConfirm: {
		type: String,
		required: [true, "User password confirm is required"],
		validate: {
			validator: function (value) {
				//Work only with Create , Save
				return value == this.password;
			},
			message: "Password does not match",
		},
	},
	role: {
		type: String,
		enum: {
			values: ["user", "lead-guide", "guide", "admin"],
			message: "Please provide correct role",
		},
		default: "user",
	},
	photo: {
		type: String,
	},
	passwordChangeTime: {
		type: Date,
	},
	forgotPasswordResetToken: String,
	forgotPasswordResetTokenExpire: Date,
});

// userSchema.pre("save", function (next) {
// 	hashPassword(this).then(next).catch(next);
// });

// No need for call next when it is async , await
userSchema.pre("save", async function (next) {
	await handlePassword(this);
});

userSchema.methods.checkPassword = async function (password, hashPassword) {
	return await bcrypt.compare(password, hashPassword);
};

userSchema.methods.checkPasswordChanged = function (timestamp) {
	if (!this.passwordChangeTime) return false;
	const changeTime = Math.floor(this.passwordChangeTime.getTime() / 1000);
	return timestamp < changeTime;
};

userSchema.methods.getForgotPasswordResetToken = async function () {
	const resetToken = await getToken();

	const hashedToken = await hashToken(resetToken);

	this.forgotPasswordResetToken = hashedToken;
	this.forgotPasswordResetTokenExpire = new Date().getTime() + 60 * 10 * 1000;

	await this.save({ validateBeforeSave: false });

	return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
