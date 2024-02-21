const Reviews = require("../model/reviewModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("../utils/factoryHandler.js");

exports.setUserTourIds = catchAsync(async (req, res, next) => {
	const data = req.body;
	data.user = req.user._id;
	data.tour = req.params.tourId;
});

exports.setTourId = catchAsync(async (req, res, next) => {
	req.filter = { tour: req.params.tourId };
});

exports.getAllReviews = factory.getAll(Reviews, {
	path: "tour",
	select: "name",
});

exports.getOne = factory.getOne(Reviews);
exports.addReview = factory.create(Reviews);

exports.deleteReview = factory.delete(Reviews);
exports.updateReview = factory.update(Reviews);
