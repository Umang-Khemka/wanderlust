const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview } = require("../middlewares/validateReview.js");
const { isLoggedIn, isReviewAuthor } = require("../middlewares/authenticate.js");
const reviewController = require("../controllers/reviews.js");

// Post route for creating a review
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete route for deleting a review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;