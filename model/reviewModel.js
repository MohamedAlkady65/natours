const mongoose = require("mongoose");
const Tour = require("./tourModel");

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
		rating: {
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
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

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
reviewSchema.statics.calcAverageRatings = async function name(tourId) {
	const stats = await this.aggregate([
		{
			$match: { tour: tourId },
		},
		{
			$group: {
				_id: "$tour",
				nRating: { $sum: 1 },
				avgRating: { $avg: "$rating" },
			},
		},
	]);

	if (stats.length > 0) {
		await Tour.findByIdAndUpdate(tourId, {
			ratingsAverage: stats[0].avgRating,
			ratingsQuantity: stats[0].nRating,
		});
	} else {
		await Tour.findByIdAndUpdate(tourId, {
			ratingsAverage: 4.5,
			ratingsQuantity: 0,
		});
	}
};

reviewSchema.post(`save`, function () {
	this.constructor.calcAverageRatings(this.tour);
});
reviewSchema.pre(/^findOneAnd/, async function (next) {
	this.r = await this.findOne();
	next();
});
reviewSchema.post(/^findOneAnd/, async function () {
	await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
