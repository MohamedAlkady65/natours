const express = require("express");
const viewsController = require("../controller/viewsController");
const authController = require("../controller/authController");
const bookingController = require("../controller/bookingController");
const router = express.Router();

router.use(viewsController.alerts);

router.get("/account", authController.protectRoute, viewsController.account);

router.get(
	"/",
	authController.isLoggedIn,
	viewsController.getOverview
);

router.get(
	"/my-tours",
	authController.protectRoute,
	bookingController.getMyTours
);

router.get("/login", authController.isLoggedIn, viewsController.login);
router.get(
	"/tour/:tourSlug",
	authController.isLoggedIn,
	viewsController.getTour
);

module.exports = router;
