const Tour = require("../model/tourModel");
const AppError = require("../utils/appError");
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

	if (!tour) throw new AppError("Tour Not Found", 404);

	res.status(200).render("tour", {
		title: `${tour.name} Tour`,
		tour: tour,
	});
});

exports.login = catchAsync(async (req, res) => {
	res.status(200).render("login", {
		title: `Log in to your account`,
	});
});
exports.account = catchAsync(async (req, res) => {
	res.status(200).render("account", {
		title: `Account`,
	});
});

exports.alerts = (req, res, next) => {
	const { alert } = req.query;
	if (alert === "booking")
		res.locals.alert =
			"Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediatly, please come back later.";
	next();
};
