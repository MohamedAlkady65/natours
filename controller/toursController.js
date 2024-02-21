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
