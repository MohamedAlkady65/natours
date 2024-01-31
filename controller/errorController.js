const ErrorHandlers = require("../utils/errorHandler");
const AppError = require("./../utils/appError");

const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message || "",
		errors: err.errors,
		error: err,
		stack: err.stack,
	});
};
const sendErrorProd = (err, res) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message || "",
			errors: err.errors,
		});
	} else {
		res.status(500).json({
			status: "Error",
			message: "Server Error, Something went wrong",
		});
	}
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "error";

	const errorHandler = new ErrorHandlers(err);

	const error = errorHandler.handle()

	if (process.env.ENV == "development") {
		sendErrorDev(error, res);
	} else if (process.env.ENV == "production") {
		sendErrorProd(error, res);
	}
};
