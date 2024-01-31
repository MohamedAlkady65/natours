const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
	console.log(`App Listening on ${PORT}...`);
});

process.on("unhandledRejection", (err) => {
	
	console.log("Unhandled Rejection 💥💥💥");

	console.log(err.name, err.message);

	server.close(() => {
		console.log("Shutting down ....");
		process.exit(1);
	});
});
