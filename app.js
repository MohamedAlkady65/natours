const path = require("path");
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

dotenv.config({ path: "./config.env" });
const toursRouter = require("./routes/toursRouter");
const usersRouter = require("./routes/usersRouter");
const reviewsRouter = require("./routes/reviewsRouter");
const viewsRouter = require("./routes/viewsRouter");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");

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

const app = express();

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

// Body Parser
app.use(express.json({ limit: "50kb" }));

// Mongo Sanitize
app.use(mongoSanitize());


// XSS Sanitize
app.use(xss());

// Serve Static Files
app.use(express.static(path.join(__dirname, "public")));

app.use("/", viewsRouter);
app.use("/api/v1/tours", toursRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/reviews", reviewsRouter);

app.all("/test", (req, res, next) => {
	res.json({ body: req.body });
});
app.all("*", (req, res, next) => {
	next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
