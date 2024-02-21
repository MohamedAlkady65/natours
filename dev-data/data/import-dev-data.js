const fs = require("fs");
const mongoose = require("mongoose");
const Tour = require("./../../model/tourModel.js");
const User = require("./../../model/usermodel.js");
const Review = require("./../../model/reviewModel.js");

const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

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

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(
	fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);

const importData = async () => {
	try {
		await Tour.create(tours);
		await User.create(users, { validateBeforeSave: false });
		await Review.create(reviews);
		console.log("Data created successfully");
	} catch (err) {
		console.log("Error ", err);
	}
	process.exit();
};
const deleteData = async () => {
	try {
		await Tour.deleteMany();
		await User.deleteMany();
		await Review.deleteMany();
		console.log("Data deleted successfully");
	} catch (err) {
		console.log("Error ", err);
	}
	process.exit();
};

// (async () => {
// 	await deleteData();
// 	await importData();
// process.exit()
// })();

if (process.argv.includes("--delete")) {
	deleteData();
} else if (process.argv.includes("--import")) {
	importData();
}
