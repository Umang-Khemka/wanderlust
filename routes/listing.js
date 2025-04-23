const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const validateId = require("../middlewares/validateId");
const {isLoggedIn} = require("../middlewares/authenticate.js");



// Validate listing body middleware
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((detail) => detail.message).join(", ");
    throw new ExpressError(400,msg);
  } else {
    next();
  }
};


// Index Route
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

// New Route
router.get("/new", isLoggedIn,(req, res) => {
  res.render("listings/new.ejs");
});

// Show Route
router.get("/:id", validateId, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  if (!listing) {
    req.flash("error","Listing you requested does not exist");
     return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
}));


// Create Route
router.post("/", isLoggedIn,validateListing, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect("/listings");
}));


// Edit Route
router.get("/:id/edit", isLoggedIn,validateId, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) throw new ExpressError(404, "Listing not found!");
  res.render("listings/edit.ejs", { listing });
}));

// Update Route
router.put("/:id",isLoggedIn, validateId, validateListing, wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing Updated !");
  res.redirect(`/listings/${id}`);
}));

// Delete Route
router.delete("/:id",isLoggedIn, validateId, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  if (!deletedListing) throw new ExpressError(404, "Listing not found!");
  res.redirect("/listings");
}));

module.exports = router;