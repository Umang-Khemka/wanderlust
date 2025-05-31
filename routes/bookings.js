const express = require("express");
const router = express.Router({ mergeParams: true });
const bookings = require("../controllers/bookings");
const { isLoggedIn } = require("../middlewares/authenticate.js");

// Correct route: Show booking form at /listings/:id/bookings/new
router.get("/new", isLoggedIn,bookings.renderBookingForm);

// Route to create a new booking
router.post("/", isLoggedIn, bookings.createBooking);

module.exports = router;
