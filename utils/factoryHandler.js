const AppError = require("../utils/appError.js");
const catchAsync = require("../utils/catchAsync.js");
const APIFeatures = require("./apiFeatures.js");
exports.delete = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndDelete(req.params.id);

		if (!doc) {
			return next(new AppError("Not found with this ID", 404));
		}

		res.status(204).json({
			status: "success",
			data: null,
		});
	});

exports.create = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.create(req.body);

		res.status(200).json({
			status: "success",
			data: doc,
		});
	});

exports.update = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!doc) {
			return next(new AppError("Not found  with this ID", 404));
		}

		res.status(200).json({
			status: "success",
			tour: doc,
		});
	});

exports.getAll = (Model) =>
	catchAsync(async (req, res, next) => {
		const features = new APIFeatures(
			Model.find(req.filter ?? {}),
			req.query
		)
			.filter()
			.fields()
			.sort()
			.pagination();

		const docs = await features.query;

		res.status(200).json({
			status: "success",
			result: docs.length,
			data: docs,
		});
	});

exports.getOne = (Model, popOptions) =>
	catchAsync(async (req, res, next) => {
		const query = Model.findById(req.params.id);
		if (popOptions) query.populate(popOptions);
		const doc = await query;

		if (!doc) {
			return next(new AppError("Not found with this ID", 404));
		}

		res.status(200).json({
			status: "success",
			data: doc,
		});
	});
