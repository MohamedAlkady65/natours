const catchAsync = require("../utils/catchAsync.js");
const factory = require("../utils/factoryHandler.js");
const Tour = require("./../model/tourModel.js");

exports.top5Tours = (req, res, next) => {
	req.query.sort = "-ratingsAverage,price";
	req.query.limit = 5;
	next();
};

exports.getAllTours = factory.getAll(Tour);

exports.getOneTour = factory.getOne(Tour, "reviews");

exports.createTour = factory.create(Tour);

exports.deleteTour = factory.delete(Tour);

exports.updateTour = factory.update(Tour);

exports.toursStats = catchAsync(async (req, res, next) => {
	stats = await Tour.aggregate([
		{
			$match: {
				ratingsAverage: { $gte: 4.5 },
			},
		},
		{
			$group: {
				// _id: null, //for all tours
				// _id: "$difficulty",
				_id: { $toUpper: "$difficulty" },
				numTours: { $sum: 1 },
				sumRating: { $sum: "$ratingsAverage" },
				avgRating: { $avg: "$ratingsAverage" },
				avgPrice: { $avg: "$price" },
				minPrice: { $min: "$price" },
				maxPrice: { $max: "$price" },
			},
		},
		{
			$sort: { avgPrice: 1 },
		},
		{
			$project: {
				avgRating: 0,
			},
		},
		// {
		// 	$match: {
		// 		_id: { $ne: "EASY" },
		// 	},
		// },
	]);

	res.status(200).json({
		status: "success",
		stats,
	});
});
exports.toursPlan = catchAsync(async (req, res, next) => {
	const year = req.params.year * 1;

	plan = await Tour.aggregate([
		{
			$unwind: "$startDates",
		},
		{
			$match: {
				startDates: {
					$gte: new Date(`${year}-01-01`),
					$lte: new Date(`${year}-12-31`),
				},
			},
		},
		{
			$group: {
				_id: { $month: "$startDates" },
				numTours: { $sum: 1 },
				tours: {
					$push: "$name",
				},
			},
		},
		{
			$addFields: {
				month: "$_id",
			},
		},
		{
			$project: {
				_id: 0,
			},
		},
		{
			$sort: {
				month: 1,
			},
		},
		{
			$limit: 12,
		},
	]);

	res.status(200).json({
		status: "success",
		plan,
	});
});

//
exports.getToursWithin = catchAsync(async (req, res, next) => {
	const { distance, latlng, unit } = req.params;
	const [lat, lng] = latlng.split(",");

	const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

	if (!lat || !lng) {
		next(
			new AppError(
				"Please provide latitutr and longitude in the format lat,lng.",
				400
			)
		);
	}

	const tours = await Tour.find({
		startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
	});

	res.status(200).json({
		status: "success",
		results: tours.length,
		data: {
			data: tours,
		},
	});
});

exports.getDistances = catchAsync(async (req, res, next) => {
	const { latlng, unit } = req.params;
	const [lat, lng] = latlng.split(",");

	const multiplier = unit === "mi" ? 0.000621371 : 0.001;

	if (!lat || !lng) {
		next(
			new AppError(
				"Please provide latitutr and longitude in the format lat,lng.",
				400
			)
		);
	}
	const distances = await Tour.aggregate([
		{
			$geoNear: {
				near: {
					type: "Point",
					coordinates: [lng * 1, lat * 1],
				},
				distanceField: "distance",
				distanceMultiplier: multiplier,
			},
		},
		{
			$project: {
				distance: 1,
				name: 1,
			},
		},
	],);

	res.status(200).json({
		status: "success",
		data: {
			data: distances,
		},
	});
});
