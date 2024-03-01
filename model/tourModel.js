const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
const User = require("./usermodel");

const tourSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "A tour must have a name"],
			unique: true,
			trim: true,
			minlength: [5, "A tour name must be greater than or equal 5"],
			maxlength: [40, "A tour name must be less than or equal 40"],
			// validate: [
			// 	validator.isAlpha,
			// 	"A tour name must me only characters",
			// ],
		},
		slug: String,
		duration: {
			type: Number,
			required: [true, "A tour must have a duration"],
		},
		maxGroupSize: {
			type: Number,
			required: [true, "A tour must have a group size"],
		},
		difficulty: {
			type: String,
			required: [true, "A tour must have a difficulty"],
			enum: {
				values: ["easy", "medium", "difficult"],
				message: "Difficulty is either: easy, medium, difficult",
			},
		},
		ratingsAverage: {
			type: Number,
			default: 4.5,
			min: [0, "A tour rating must be between 0 and 5"],
			max: [5, "A tour rating must be between 0 and 5"],
			set: (val) => Math.round(val * 10) / 10,
		},
		ratingsQuantity: {
			type: Number,
			default: 0,
		},
		price: {
			type: Number,
			required: [true, "A tour must have a price"],
		},
		priceDiscount: {
			type: Number,
			validate: {
				validator: function (val) {
					return val < this.price;
				},
				message:
					"Discount price ({VALUE}) should be below regular price",
			},
		},
		summary: {
			type: String,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
			required: [true, "A tour must have a description"],
		},
		imageCover: {
			type: String,
			required: [true, "A tour must have a cover image"],
		},
		images: [String],
		createdAt: {
			type: Date,
			default: Date.now(),
			select: false,
		},
		startDates: [Date],
		secret: {
			type: Boolean,
			default: false,
		},
		startLocation: {
			type: {
				type: String,
				default: "Point",
				emun: ["Point"],
			},
			coordinates: [Number],
			description: String,
			address: String,
		},
		locations: [
			{
				type: {
					type: String,
					default: "Point",
					emun: ["Point"],
				},
				coordinates: [Number],
				description: String,
				address: String,
				day: Date,
			},
		],
		guides: [
			{
				type: mongoose.Schema.ObjectId,
				ref: "User",
			},
		],
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual("durationWeek").get(function () {
	return Math.ceil(this.duration / 7);
});

tourSchema.virtual("reviews", {
	ref: "Review",
	foreignField: "tour",
	localField: "_id",
});

// Document Middleware
tourSchema.pre("save", function (next) {
	this.slug = slugify(this.name);
	next();
});

// tourSchema.pre("save", async function (next) {
// 	const guidesPromises = this.guides.map(
// 		async (id) => await User.findById(id)
// 	);
// 	this.guides = await Promise.all(guidesPromises);

// 	next();
// });

// tourSchema.post("save", function (doc, next) {
// 	console.log(doc);
// 	next();
// });

tourSchema.pre(/^find/, function (next) {
	this.find({ secret: { $ne: true } });
	next();
});

tourSchema.pre(/^find/, function (next) {
	this.populate({
		path: "guides",
		select: "-__v",
	});
	next();
});

// tourSchema.post("find", function (docs, next) {
// 	console.log(docs);
// 	next();
// });
tourSchema.pre("aggregate", function (next) {
	// this.pipeline().unshift({ $match: { secret: { $ne: true } } });
	next();
});
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
