const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const validateId = require("../middlewares/validateId");
const { isLoggedIn, isOwner } = require("../middlewares/authenticate.js");
const { validateListing } = require("../middlewares/validateListing");
const listingController = require("../controllers/listing.js");
const multer  = require("multer")
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

// Index Route
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn,  upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));


// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show, Edit, Update, Delete Routes
router.route("/:id")
  .get(validateId, wrapAsync(listingController.showListing))
  .put(isLoggedIn, isOwner,upload.single("listing[image]"), validateId, validateListing, wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, validateId, wrapAsync(listingController.deleteListing));

// Edit Route (Separate route for clarity, could be combined with Show and Update routes)
router.get("/:id/edit", isLoggedIn, isOwner, validateId, wrapAsync(listingController.editListing));

module.exports = router;
