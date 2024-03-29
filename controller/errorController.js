const ErrorHandlers = require("../utils/errorHandler");
const AppError = require("./../utils/appError");

const sendErrorDevApi = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message || "",
		errors: err.errors,
		error: err,
		stack: err.stack,
	});
};
const sendErrorProdApi = (err, res) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message || "",
			errors: err.errors,
		});
	} else {
		console.log(err);
		res.status(500).json({
			status: "Error",
			message: "Server Error, Something went wrong",
		});
	}
};
const sendErrorDevWebsite = (err, res) => {
	res.status(err.statusCode).render("error", {
		title: "Error",
		msg: err.message,
	});
};
const sendErrorProdWebsite = (err, res) => {
	if (err.isOperational) {
		if (err.statusCode == 401) {
			return res.redirect("/");
		}
		res.status(err.statusCode).render("error", {
			title: "Error",
			msg: err.message,
		});
	} else {
		console.log(err);
		res.status(err.statusCode).render("error", {
			title: "Error",
			msg: "Server Error, Something went wrong",
		});
	}
};
const sendErrorWebsite = (err, res) => {
	if (process.env.ENV == "development") {
		sendErrorDevWebsite(err, res);
	} else if (process.env.ENV == "production") {
		sendErrorProdWebsite(err, res);
	}
};
const sendErrorApi = (err, res) => {
	if (process.env.ENV == "development") {
		sendErrorDevApi(err, res);
	} else if (process.env.ENV == "production") {
		sendErrorProdApi(err, res);
	}
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "error";

	const errorHandler = new ErrorHandlers(err);

	const error = errorHandler.handle();

	if (req.originalUrl.startsWith("/api")) {
		sendErrorApi(error, res);
	} else {
		sendErrorWebsite(error, res);
	}
};
