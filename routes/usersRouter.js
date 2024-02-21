const express = require("express");
const usersController = require("./../controller/usersController");
const authController = require("./../controller/authController");
const factory = require("../utils/factoryHandler.js");

const router = express.Router();

router.post("/signUp", authController.signUp);
router.post("/signIn", authController.signIn);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.patch(
	"/updatePassword",
	authController.protectRoute,
	authController.updatePassword
);

router.patch("/updateMe", authController.protectRoute, authController.updateMe);
router.delete(
	"/deleteMe",
	authController.protectRoute,
	authController.deleteMe
);

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
