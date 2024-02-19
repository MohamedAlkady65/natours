const path = require("path");
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const toursRouter = require("./routes/toursRouter");
const usersRouter = require("./routes/usersRouter");
const reviewsRouter = require("./routes/reviewsRouter");
const viewsRouter = require("./routes/viewsRouter");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");

const app = express();

if (process.env.ENV == "development") {
	app.use(morgan("dev"));
}

console.log(process.env.DATABASE);

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

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "/views"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// app.use((req, res, next) => {
// 	console.log("Hello from middleware");
// 	next();
// });

// app.use((req, res, next) => {
// 	req.requestedAt = new Date().toISOString();
// 	next();
// });



app.use("/", viewsRouter);
app.use("/api/v1/tours", toursRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/reviews", reviewsRouter);

app.all("*", (req, res, next) => {
	next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
