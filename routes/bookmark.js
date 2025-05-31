const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middlewares/authenticate.js");
const bookmarkController = require("../controllers/bookmarks.js");

// View all bookmarks
router.get("/", isLoggedIn, wrapAsync(bookmarkController.showBookmarks));

// Add bookmark
router.post("/:id", isLoggedIn, wrapAsync(bookmarkController.addBookmark));

// Remove bookmark
router.delete("/:id", isLoggedIn, wrapAsync(bookmarkController.removeBookmark));

module.exports = router;
