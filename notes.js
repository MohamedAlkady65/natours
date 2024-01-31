// express send not found respone by default for wrong route
app.get("/", (req, res) => {
	// by Default status code 200
	// res.send("Hello from server side")

	// res.status(404).send("Hello from server side");

	// set Content-type to application/json
	res.status(200).json({ message: "Hello from server side" });
});
app.post("/", (req, res) => {
	res.status(200).send("This is Post endpoint");
});

//////////////////////////////////////////////////////////////////////

app.get("/api/v1/tours", getAllTours);
app.post("/api/v1/tours", createTour);
app.get("/api/v1/tours/:id", getOneTour);
app.patch("/api/v1/tours/:id", updateTour);
app.delete("/api/v1/tours/:id", deleteTour);

app.route("/api/v1/tours").get(getAllTours).post(createTour);

// difficulty=easy&difficulty=hard&duration[gt]=5&duration[lt]=8&page=6&page[ls]=10

// {
// 	difficulty: [ 'easy', 'hard' ],
// 	duration: { gt: '5', lt: '8' },
// 	page: [ '6', { ls: '10' } ]
//   }

// const query = Tour.find().where("duration").equals(5);


exports.resetPassword = catchAsync(async (req, res, next) => {
	const user = req.user;
	const oldPassword = req.body.oldPassword;
	const newPassword = req.body.newPassword;
	const confirmNewPassword = req.body.confirmNewPassword;

	if (!oldPassword) {
		return next(new AppError("Please provide old password", 400));
	}
	if (!newPassword) {
		return next(new AppError("Please provide new password", 400));
	}
	if (!confirmNewPassword) {
		return next(new AppError("Please confirm new password", 400));
	}

	const oldPasswordIsCorrect = await user.checkPassword(
		oldPassword,
		user.password
	);

	if (!oldPasswordIsCorrect) {
		return next(new AppError("Old password is incorrect", 401));
	}

	user.password = newPassword;
	user.passwordConfirm = confirmNewPassword;
	user.passwordChangeTime = new Date().getTime();
	await req.user.save();

	const token = await signToken(user._id);

	res.status(200).json({
		status: "success",
		message: "Password has been successfully",
		token,
	});
});

