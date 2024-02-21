const catchAsync = require("../utils/catchAsync.js");
const User = require("../model/usermodel.js");

exports.getAllUsers = catchAsync(async (req, res) => {
	const users = await User.find();

	res.status(200).json({
		status: "success",
		result: users.length,
		users,
	});
});

exports.createUser = (req, res) => {
	res.status(500).json({
		status: "error",
		message: "This route is not implemented",
	});
};

exports.getOneUser = (req, res) => {
	res.status(500).json({
		status: "error",
		message: "This route is not implemented",
	});
};

exports.updateUser = (req, res) => {
	res.status(500).json({
		status: "error",
		message: "This route is not implemented",
	});
};
exports.deleteUser = factory.delete(User);
