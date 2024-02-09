const router = require("express").Router({ mergeParams: true });
const reviewsController = require("../controller/reviewsController");
const authController = require("./../controller/authController");

router
	.route("/")
	.get(reviewsController.getAllReviews)
	.post(
		authController.protectRoute,
		authController.restrictTo("user"),
		reviewsController.addReview
	);

module.exports = router;
