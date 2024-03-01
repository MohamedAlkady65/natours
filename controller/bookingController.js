const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Booking = require("../model/bookingModel.js");
const AppError = require("../utils/appError.js");
const catchAsync = require("../utils/catchAsync.js");
const Tour = require("./../model/tourModel.js");
const factory = require("../utils/factoryHandler.js");
const User = require("../model/usermodel.js");

exports.checkOut = catchAsync(async (req, res, next) => {
	const tourId = req.params.tourId;
	const tour = await Tour.findById(tourId);

	if (!tour) {
		return next(new AppError("Tour not found", 404));
	}

	const price = await stripe.prices.create({
		currency: "usd",
		unit_amount: tour.price * 100,

		product_data: {
			name: tour.name,
		},
	});

	const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		success_url: `${req.protocol}://${req.get(
			"host"
		)}/my-tours?alert=booking`,
		cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
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

const createBookingCheckout = async (session) => {
	const tour = session.client_reference_id;
	const user = (await User.findOne({ email: session.customer_email })).id;
	const price = session.amount_total / 100;
	await Booking.create({ tour, user, price });
};

exports.webhookCheckout =catchAsync( async (req, res, next) => {
	const signature = req.headers["stripe-signature"];

	let event;
	try {
		event = stripe.webhooks.constructEvent(
			req.body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET
		);
	} catch (err) {
		return res.status(400).send(`Webhook error: ${err.message}`);
	}

	if (event.type === "checkout.session.completed")
		await createBookingCheckout(event.data.object);

	res.status(200).json({ received: true });
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
