const User = require("../model/usermodel.js");
const factory = require("../utils/factoryHandler.js");
const catchAsync = require("../utils/catchAsync.js");

exports.getAllUsers = factory.getAll(User);

exports.createUser = factory.create(User);

exports.getMe = catchAsync(async (req, res, next) => {
	req.params.id = req.user.id;
	next();
});
exports.getOneUser = factory.getOne(User);

exports.updateUser = factory.update(User);

exports.deleteUser = factory.delete(User);

exports.updateMe = catchAsync(async (req, res, next) => {
	const filterdObj = filterObj(req.body, "name", "email");
	const newUser = await User.findByIdAndUpdate(req.user.id, filterdObj, {
		new: true,
		runValidators: true,
	});
	res.status(200).json({
		status: "success",
		data: {
			user: newUser,
		},
	});
});
exports.deleteMe = catchAsync(async (req, res, next) => {
	await User.findByIdAndUpdate(
		req.user.id,
		{ active: false },
		{
			new: true,
			runValidators: true,
		}
	);
	res.status(204).json({
		status: "success",
		data: null,
	});
});
