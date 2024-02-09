const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
	{
		review: {
			type: String,
			required: [true, "Review is required"],
		},
		createdAt: {
			type: Date,
			default: Date.now(),
			select: false,
		},
		rate: {
			type: Number,
			required: [true, "Rate is required"],
			min: [0, "A tour rating must be between 0 and 5"],
			max: [5, "A tour rating must be between 0 and 5"],
		},
		tour: {
			type: mongoose.Schema.ObjectId,
			ref: "Tour",
			required: [true, "Review must belongs to tour"],
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: [true, "Review must belongs to user"],
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

reviewSchema.pre(/^find/, function (next) {
	// this.populate({ path: "tour", select: "name" }).populate({
	// 	path: "user",
	// 	select: "name photo",
	// });
	this.populate({
		path: "user",
		select: "name photo",
	});
	next();
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
