const router = require("express").Router({ mergeParams: true });
const reviewsController = require("../controller/reviewsController");
const authController = require("./../controller/authController");

// Protect all routes after this middleware
router.use(authController.protectRoute);

router
	.route("/")
	.get(reviewsController.setTourId, reviewsController.getAllReviews)
	.post(
		authController.protectRoute,
		authController.restrictTo("user"),
		reviewsController.setUserTourIds,
		reviewsController.addReview
	);

router
	.route("/:id")
	.get(reviewsController.getOne)
	.delete(
		authController.restrictTo("user", "admin"),
		reviewsController.deleteReview
	)
	.patch(
		authController.restrictTo("user", "admin"),
		reviewsController.updateReview
	);

module.exports = router;
