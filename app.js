const path = require("path");

const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const compression = require("compression");

dotenv.config({ path: "./config.env" });
const toursRouter = require("./routes/toursRouter");
const usersRouter = require("./routes/usersRouter");
const reviewsRouter = require("./routes/reviewsRouter");
const viewsRouter = require("./routes/viewsRouter");
const bookingRouter = require("./routes/bookingRouter");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");

const app = express();

const connectionString = process.env.DATABASE.replace(
	"<PASSWORD>",
	process.env.DATABASE_PASSWORD
);
mongoose
	.connect(connectionString, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then((val) => console.log("Connected Successfully"))
	.catch((err) => console.log("Faild to Connect"));

// Set HTTP Security Headers
app.use(helmet());

// Apply Rate Limit
const limiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	limit: 500,
	legacyHeaders: false,
});
app.use("/api", limiter);

//Develeopment Logging
if (process.env.ENV == "development") {
	app.use(morgan("dev"));
}

// Set Pug Views Settings
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "/views"));

// Body, Cookie Parser
app.use(express.json({ limit: "50kb" }));
app.use(cookieParser());

// Mongo Sanitize
app.use(mongoSanitize());

// XSS Sanitize
app.use(xss());

// Prevent HTTP Parameter Pollution
app.use(
	hpp({
		whitelist: [
			"duration",
			"ratingsQuantity",
			"ratingsAverage",
			"maxGroupSize",
			"difficulty",
			"price",
		],
	})
);

// Serve Static Files
app.use(express.static(path.join(__dirname, "public")));

app.use(compression());

app.use("/", viewsRouter);
app.use("/api/v1/tours", toursRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/reviews", reviewsRouter);
app.use("/api/v1/booking", bookingRouter);

app.all("*", (req, res, next) => {
	next(
		new AppError(
			`Route ${req.originalUrl} not found`,
			404,
			undefined,
			false
		)
	);
});

app.use(globalErrorHandler);

module.exports = app;
