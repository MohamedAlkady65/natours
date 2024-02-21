const AppError = require("../utils/appError.js");
const catchAsync = require("../utils/catchAsync.js");
exports.delete = Model => catchAsync(async (req, res, next) => {
	const doc = await Model.findByIdAndDelete(req.params.id);

	if (!doc) {
		return next(new AppError("Not found with this ID", 404));
	}

	res.status(204).json({
		status: "success",
		data: null,
	});
});


