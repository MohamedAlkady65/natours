const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Booking = require("../model/bookingModel.js");
const AppError = require("../utils/appError.js");
const catchAsync = require("../utils/catchAsync.js");
const Tour = require("./../model/tourModel.js");
const factory = require("../utils/factoryHandler.js");

exports.checkOut = catchAsync(async (req, res, next) => {
	const tourId = req.params.tourId;
	const tour = await Tour.findById(tourId);

	if (!tour) {
		return next(new AppError("Tour not found", 404));
	}

	console.log(tour.price);
	console.log(tour._id);

	const price = await stripe.prices.create({
		currency: "usd",
		unit_amount: tour.price * 100,

		product_data: {
			name: tour.name,
		},
	});

	const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		success_url: `${req.protocol}://${req.get("host")}/tours/${
			tour.slug
		}/?tour=${tour._id}&user=${req.user._id}&price=${tour.price}`,
		cancel_url: `${req.protocol}://${req.get("host")}/`,
		client_reference_id: tourId,
		currency: "usd",
		customer_email: req.user.email,
		mode: "payment",
		line_items: [
			{
				price: price.id,
				quantity: 1,
			},
		],
	});

	res.status(200).json({
		status: "success",
		session,
	});
});

exports.createBookingcheckOut = catchAsync(async (req, res, next) => {
	console.log(req.originalUrl);
	const { tour, user, price } = req.query;

	console.log({ tour, user, price });

	if (!tour || !user || !price) return next();

	await Booking.create({ tour, user, price });

	res.redirect(req.originalUrl.split("?")[0]);
});
exports.getMyTours = catchAsync(async (req, res, next) => {
	const bookings = await Booking.find({ user: req.user.id });

	const toursIds = bookings.map((e) => e.tour._id);

	const tours = await Tour.find({ _id: { $in: toursIds } });

	res.status(200).render("overview", { title: "All Tour", tours });
});

exports.getAllBookings = factory.getAll(Booking);
exports.getOneBooking = factory.getOne(Booking);
exports.addBooking = factory.create(Booking);
exports.deleteBooking = factory.delete(Booking);
exports.updateBooking = factory.update(Booking);
