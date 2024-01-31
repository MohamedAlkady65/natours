const AppError = require("./appError");

class ErrorHandlers {
	constructor(error) {
		this.error = error;
	}

	handle = () => {
		if (this.error.isOperational) {
			return this.error;
		}

		let error;
		if (this.error.name == "CastError") {
			error = this.#handleCastingError();
		} else if (
			this.error.name == "MongoError" &&
			this.error.code == 11000
		) {
			error = this.#handleDuplicateUniqueError();
		} else if (this.error.errors) {
			error = this.#handleValidationError();
		} else if (this.error.name == "JsonWebTokenError") {
			error = this.#handleInvalidToken();
		} else if (this.error.name == "TokenExpiredError") {
			error = this.#handleExpiredToken();
		} else {
			error = this.error;
		}

		return error;
	};

	#handleCastingError = () => {
		const message = `Invalid ${this.error.path} : ${this.error.value}`;
		return new AppError(message, 400);
	};
	#handleDuplicateUniqueError = () => {
		const key = Object.keys(this.error.keyValue)[0];
		const value = this.error.keyValue[key];
		const message = `Invalid Duplicate ${key}: ${value}`;
		return new AppError(message, 400);
	};
	#handleValidationError = () => {
		const errors = {};
		Object.keys(this.error.errors).forEach((er) => {
			const prop = this.error.errors[er].properties;
			errors[prop.path] = prop.message;
		});

		return new AppError("Validation Error", 400, errors);
	};
	#handleInvalidToken = () => new AppError("Token provided is invalid", 401);
	#handleExpiredToken = () => new AppError("Token provided is expired", 401);
}

module.exports = ErrorHandlers;
