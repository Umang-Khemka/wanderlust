const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const validateId = require("../middlewares/validateId");
const {isLoggedIn,isOwner} = require("../middlewares/authenticate.js");
const {validateListing} = require("../middlewares/validateListing");

const listingController = require("../controllers/listing.js");


// Index Route
router.get("/", wrapAsync(listingController.index));

// New Route
router.get("/new", isLoggedIn,listingController.renderNewForm);

// Show Route
router.get("/:id", validateId, wrapAsync(listingController.showListing));


// Create Route
router.post("/", isLoggedIn,validateListing, wrapAsync(listingController.createListing));


// Edit Route
router.get("/:id/edit", isLoggedIn,isOwner,validateId, wrapAsync(listingController.editListing));

// Update Route
router.put("/:id",isLoggedIn,isOwner, validateId, validateListing, wrapAsync(listingController.updateListing));

// Delete Route
router.delete("/:id",isLoggedIn,isOwner, validateId, wrapAsync(listingController.deleteListing));

module.exports = router;