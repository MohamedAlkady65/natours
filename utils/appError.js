class AppError extends Error {
	constructor(message, statusCode,errors) {
		super(message);
		this.message = message
		this.statusCode = statusCode;
		this.status = Math.floor(statusCode / 100) == 4 ? "fail" : "error";
		this.isOperational = true;
		if(errors)
		{
			this.errors=errors
		}
        Error.captureStackTrace(this,this.constructor)
	}
}

module.exports = AppError;
