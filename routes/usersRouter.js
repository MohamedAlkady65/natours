const express = require("express");
const usersController = require("./../controller/usersController");
const authController = require("./../controller/authController");

const router = express.Router();

router.post("/signUp", authController.signUp);
router.post("/signIn", authController.signIn);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router
	.route("/changePassword")
	.patch(authController.protectRoute, authController.changePassword);

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
