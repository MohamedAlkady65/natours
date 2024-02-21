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
