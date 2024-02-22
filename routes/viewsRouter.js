const express = require("express");
const viewsController = require("../controller/viewsController");
const authController = require("../controller/authController");
const router = express.Router();

router.use(authController.isLoggedIn);

router.get("/", viewsController.getOverview);
router.get("/login", viewsController.login);
router.get("/tour/:tourSlug", viewsController.getTour);

module.exports = router;
