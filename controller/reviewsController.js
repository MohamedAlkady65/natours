const Reviews = require("../model/reviewModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("../utils/factoryHandler.js");

exports.getAllReviews = catchAsync(async (req, res, next) => {
	let filter = {};

	if (req.params.tourId) filter = { tour: req.params.tourId };

	const reviews = await Reviews.find(filter).populate({
		path: "tour",
		select: "name",
	});

	res.status(200).json({
		status: "success",
		results: reviews.length,
		data: reviews,
	});
});
exports.addReview = catchAsync(async (req, res, next) => {
	const data = req.body;
	data.user = req.user._id;
	data.tour = req.params.tourId;
	const review = await Reviews.create(data);

	res.status(201).json({
		status: "success",
		review,
	});
});

exports.deleteReview  = factory.delete(Reviews);
