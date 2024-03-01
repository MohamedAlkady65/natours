const express = require("express");
const toursController = require("./../controller/toursController");
const authController = require("./../controller/authController");
const reviewsRouter = require("./reviewsRouter");
const router = express.Router();

router.use("/:tourId/reviews", reviewsRouter);

router
	.route("/top-5-tours")
	.get(toursController.top5Tours, toursController.getAllTours);

router.route("/tours-stats").get(toursController.toursStats);
router
	.route("/tours-plan/:year")
	.get(
		authController.protectRoute,
		authController.restrictTo("admin", "lead-guide", "guide"),
		toursController.toursPlan
	);

router
	.route("/tours-within/:distance/center/:latlng/unit/:unit")
	.get(toursController.getToursWithin);
router
	.route("/distance/center/:latlng/unit/:unit")
	.get(toursController.getDistances);
router
	.route("/")
	.get(toursController.getAllTours)
	.post(
		authController.protectRoute,
		authController.restrictTo("admin", "lead-guide"),
		toursController.createTour
	);

router
	.route("/:id")
	.get(toursController.getOneTour)
	.patch(
		authController.protectRoute,
		authController.restrictTo("admin", "lead-guide"),
		toursController.updateTour
	)
	.delete(
		authController.protectRoute,
		authController.restrictTo("admin", "lead-guide"),
		toursController.deleteTour
	);

module.exports = router;
