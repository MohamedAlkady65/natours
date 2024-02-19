const Tour = require("../model/tourModel");
const catchAsync = require("../utils/catchAsync");

exports.getOverview = catchAsync(async (req, res) => {
	const tours = await Tour.find();

	res.status(200).render("overview", { title: "All Tour", tours });
});

exports.getTour = catchAsync(async (req, res) => {
	const slug = req.params.tourSlug;
	const tour = await Tour.findOne({ slug: slug }).populate({
		path: "reviews",
		fields: "review rating user",
	});
	res.status(200).render("tour", {
		title: "The Forest Hicker",
		tour: tour,
	});
});
