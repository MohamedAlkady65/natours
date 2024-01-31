const jwt = require("jsonwebtoken");
const User = require("../model/usermodel.js");
const AppError = require("../utils/appError.js");
const catchAsync = require("../utils/catchAsync.js");
const { sendEmail } = require("../utils/email.js");
const { hashToken } = require("../utils/encrypt");

const signToken = async (id) => {
	return await jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "90d" });
};

const sendToken = async (res, user, sendUser = false) => {
	const token = await signToken(user._id);

	const resObj = {
		status: "success",
		token,
	};

	if (sendUser) resObj.user = user;

	const cookieOptions = {
		expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
		httpOnly: true,
	};

	if (process.env.ENV == "production") cookieOptions.secure = true;

	res.cookie("jwt", token);

	res.status(200).json(resObj);
};

exports.signUp = catchAsync(async (req, res, next) => {
	const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirm: req.body.passwordConfirm,
		role: req.body.role,
	});

	const userObj = newUser.toObject();
	delete userObj.password;

	await sendToken(res, userObj, true);
});

exports.signIn = catchAsync(async (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	if (!email || !password) {
		return next(new AppError("Please provide email and password", 400));
	}

	const user = await User.findOne({ email }).select("+password");
	const correct = user
		? await user.checkPassword(password, user.password)
		: false;

	if (!user || !correct) {
		return next(new AppError("Email or password is incorrect", 401));
	}

	await sendToken(res, user);
});

exports.protectRoute = catchAsync(async (req, res, next) => {
	// Check Token Exists
	const auth = req.headers.authorization;

	if (!auth || !auth.startsWith("Bearer")) {
		next(new AppError("No token found, Please log in and try again", 401));
	}

	// Token verfication
	const token = auth.split(" ")[1];
	const payload = jwt.verify(token, process.env.JWT_SECRET);

	// Check user exists
	const currentUser = await User.findById(payload.id).select("+password");
	if (!currentUser) {
		return next(new AppError("Invalid Token, User is not exists", 401));
	}

	// Check password not changed
	const changed = currentUser.checkPasswordChanged(payload.iat);
	if (changed) {
		return next(
			new AppError("Invalid Token, Password has been changed", 401)
		);
	}
	req.user = currentUser;
	next();
});

exports.restrictTo = (...roles) =>
	catchAsync(async (req, res, next) => {
		if (!["admin", "lead-guide"].includes(req.user.role)) {
			return next(
				new AppError("Forbidden, You have not permission", 403)
			);
		}

		next();
	});

exports.changePassword = catchAsync(async (req, res, next) => {
	const user = req.user;
	const oldPassword = req.body.oldPassword;
	const newPassword = req.body.newPassword;
	const confirmNewPassword = req.body.confirmNewPassword;

	if (!oldPassword) {
		return next(new AppError("Please provide old password", 400));
	}
	if (!newPassword) {
		return next(new AppError("Please provide new password", 400));
	}
	if (!confirmNewPassword) {
		return next(new AppError("Please confirm new password", 400));
	}

	const oldPasswordIsCorrect = await user.checkPassword(
		oldPassword,
		user.password
	);

	if (!oldPasswordIsCorrect) {
		return next(new AppError("Old password is incorrect", 401));
	}

	user.password = newPassword;
	user.passwordConfirm = confirmNewPassword;
	user.passwordChangeTime = new Date().getTime();
	await user.save();

	await sendToken(res, user);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
	const email = req.body.email;

	if (!email) {
		return next(new AppError("Please provide your email address"));
	}

	const user = await User.findOne({ email });

	if (!user) {
		return next(new AppError("No user with this email"));
	}

	const resetToken = await user.getForgotPasswordResetToken();
	const resetUrl = `${req.protocol}://${req.hostname}/api/v1/users/resetPassword/${resetToken}`;

	const message = `Hello ${user.name}
To reset your password
Please PATCH request to ${resetUrl}
If you don't want, ignore this email`;

	try {
		await sendEmail({
			email,
			subject: "Your password reset link (valid for 10 minutes)",
			text: message,
		});

		res.status(200).json({
			status: "success",
			message: "Reset link was sent successfully",
		});
	} catch (error) {
		user.forgotPasswordResetToken = undefined;
		user.forgotPasswordResetTokenExpire = undefined;
		await user.save({ validateBeforeSave: false });

		return next(
			new AppError("Cannot send email now, please try again later", 500)
		);
	}
});

exports.resetPassword = catchAsync(async (req, res, next) => {
	const newPassword = req.body.newPassword;
	const confirmNewPassword = req.body.confirmNewPassword;

	if (!newPassword) {
		return next(new AppError("Please provide new password", 400));
	}
	if (!confirmNewPassword) {
		return next(new AppError("Please confirm new password", 400));
	}

	token = req.params.token;

	const hashedToken = await hashToken(token);

	// const user = await User.findOne({
	// 	forgotPasswordResetToken: hashedToken,
	// 	forgotPasswordResetTokenExpire: { $gte: Date.now() },
	// });
	const user = await User.findOne({ forgotPasswordResetToken: hashedToken });

	if (!user) {
		return next(new AppError("Invalid Token", 400));
	}

	const expireTime = user.forgotPasswordResetTokenExpire;
	const currentTime = new Date();
	const tokenExpired = currentTime >= expireTime;

	if (tokenExpired) {
		return next(
			new AppError(
				"Reset token has beed expired, get new one and try again",
				401
			)
		);
	}

	user.password = newPassword;
	user.passwordConfirm = confirmNewPassword;
	user.passwordChangeTime = new Date().getTime();
	user.forgotPasswordResetToken = undefined;
	user.forgotPasswordResetTokenExpire = undefined;

	await user.save();

	res.status(200).json({
		status: "success",
		message: "Password has been changed successfully",
	});
});
