const router = require("express").Router({ mergeParams: true });
const reviewsController = require("../controller/reviewsController");
const authController = require("./../controller/authController");

router
	.route("/")
	.get(reviewsController.setTourId, reviewsController.getAllReviews)
	.post(
		authController.protectRoute,
		authController.restrictTo("user"),
		reviewsController.setUserTourIds,
		reviewsController.addReview
	);

router.delete("/:id", reviewsController.deleteReview);

module.exports = router;
