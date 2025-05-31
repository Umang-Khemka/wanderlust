const Listing = require("../models/listing");
const Booking = require("../models/booking");

module.exports.renderBookingForm = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  const bookingsForListing = await Booking.find({ listing: listing._id });

  //  Generate all individual booked dates from each booking's range
  const bookedDates = [];
  bookingsForListing.forEach(booking => {
    let current = new Date(booking.startDate);
    const end = new Date(booking.endDate);

    while (current <= end) {
      bookedDates.push(new Date(current).toISOString().split("T")[0]); // Format to 'YYYY-MM-DD'
      current.setDate(current.getDate() + 1);
    }
  });

  res.render("bookings/new", {
    listing,
    bookedDates // used in front-end JS to disable dates
  });
};

// Create a new booking
module.exports.createBooking = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  const [start, end] = req.body.bookingDate.split(" to "); // flatpickr gives this format
  const startDate = new Date(start);
  const endDate = new Date(end);

  // Check if any dates in the range are already booked
  const overlappingBookings = await Booking.find({
    listing: listing._id,
    $or: [
      {
        startDate: { $lte: endDate },
        endDate: { $gte: startDate }
      }
    ]
  });

  if (overlappingBookings.length > 0) {
    req.flash("error", "Some of those dates are already booked!");
    return res.redirect(`/listings/${listing._id}/bookings/new`);
  }

  const booking = new Booking({
    listing: listing._id,
    user: req.user._id,
    startDate,
    endDate
  });

  await booking.save();
  req.flash("success", "Booking successful!");
  res.redirect(`/listings/${listing._id}`);
};

