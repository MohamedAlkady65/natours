const express = require("express");
const bookingController = require("../controller/bookingController");
const authController = require("../controller/authController");
const router = express.Router();

router.get(
	"/checkOut/:tourId",
	authController.protectRoute,
	bookingController.checkOut
);

router.use(
	authController.protectRoute,
	authController.restrictTo("admin", "lead-guide")
);

router
	.route("/")
	.post(bookingController.addBooking)
	.get(bookingController.getAllBookings);
router
	.route("/:id")
	.get(bookingController.getOneBooking)
	.delete(bookingController.deleteBooking)
	.patch(bookingController.updateBooking);

module.exports = router;
