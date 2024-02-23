const express = require("express");
const viewsController = require("../controller/viewsController");
const authController = require("../controller/authController");
const router = express.Router();

router.get("/account", authController.protectRoute, viewsController.account);


router.use(authController.isLoggedIn);
router.get("/", viewsController.getOverview);
router.get("/login", viewsController.login);
router.get("/tour/:tourSlug", viewsController.getTour);

module.exports = router;
