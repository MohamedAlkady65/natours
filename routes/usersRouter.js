const express = require("express");
const usersController = require("./../controller/usersController");
const authController = require("./../controller/authController");

const router = express.Router();

router.post("/signUp", authController.signUp);
router.post("/signIn", authController.signIn);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protectRoute);

router.patch("/updatePassword", authController.updatePassword);

router.patch("/updateMe", authController.protectRoute, authController.updateMe);

router.delete(
	"/deleteMe",
	authController.protectRoute,
	authController.deleteMe
);

router.get(
	"/me",
	authController.protectRoute,
	usersController.getMe,
	usersController.getOneUser
);

// Restrict all routes to admin after this middleware
router.use(authController.restrictTo("admin"));
router
	.route("/")
	.get(usersController.getAllUsers)
	.post(usersController.createUser);

router
	.route("/:id")
	.get(usersController.getOneUser)
	.patch(usersController.updateUser)
	.delete(usersController.deleteUser);

module.exports = router;
