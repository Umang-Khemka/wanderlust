const User = require("../models/user.js");
const Listing = require("../models/listing.js");

module.exports.addBookmark = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id);

  if (!user.bookmarks.includes(id)) {
    user.bookmarks.push(id);
    await user.save();
    req.flash("success", "Listing bookmarked!");
  } else {
    req.flash("error", "Already bookmarked!");
  }
  res.redirect("/listings");
};

module.exports.removeBookmark = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { bookmarks: id }
  });
  req.flash("success", "Bookmark removed!");
  res.redirect("/bookmarks");
};

module.exports.showBookmarks = async (req, res) => {
  const user = await User.findById(req.user._id).populate("bookmarks");
  res.render("users/bookmarks.ejs", { bookmarks: user.bookmarks });
};
