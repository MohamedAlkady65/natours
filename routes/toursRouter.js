const express = require("express");
const toursController = require("./../controller/toursController");
const authController = require("./../controller/authController");
const reviewsRouter = require("./reviewsRouter");
const router = express.Router();

// router.param("id", toursController.checkId);
router.use("/:tourId/reviews", reviewsRouter);

router
	.route("/top-5-tours")
	.get(toursController.top5Tours, toursController.getAllTours);

router.route("/tours-stats").get(toursController.toursStats);
router.route("/tours-plan/:year").get(toursController.toursPlan);

router
	.route("/")
	.get(authController.protectRoute, toursController.getAllTours)
	.post(toursController.createTour);

router
	.route("/:id")
	.get(toursController.getOneTour)
	.patch(toursController.updateTour)
	.delete(
		authController.protectRoute,
		authController.restrictTo("admin", "lead-guide"),
		toursController.deleteTour
	);

module.exports = router;
