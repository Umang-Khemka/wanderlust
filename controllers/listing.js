const Listing = require("../models/listing");


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate({path: "reviews",populate: {path: "author",},}).populate("owner");
  if (!listing) {
    req.flash("error","Listing you requested does not exist");
     return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing, currentUser: req.user });
};

module.exports.createListing = async (req, res, next) => {
  try {
    const { title, description, category, price, location, country } = req.body.listing;
    
    // Validate category first
    const allowedCategories = [
      "Rooms",
      "Iconic Cities",
      "Castles",
      "Mountain Views",
      "Camping",
      "Amazing Nature",
      "Farms",
      "Arctic",
      "Boats"
    ];

    if (!allowedCategories.includes(category)) {
      req.flash("error", "Invalid category selected");
      return res.redirect("/listings/new");
    }

    const newListing = new Listing({
      title,
      description,
      category,
      price,
      location,
      country,
      owner: req.user._id,
      image: {
        url: req.file.path,
        filename: req.file.filename
      }
    });

    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/listings/new");
  }
};

module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) throw new ExpressError(404, "Listing not found!");
  let originalImage = listing.image.url;
  originalImage = originalImage.replace("/upload","/upload/h_300,w_250");
  res.render("listings/edit.ejs", { listing,originalImage });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(typeof req.file != "undefined") {
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = {url,filename};
  await listing.save();
  }
  req.flash("success", "Listing Updated !");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  if (!deletedListing) throw new ExpressError(404, "Listing not found!");
  res.redirect("/listings");
};

module.exports.filterByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Find listings where category matches (case-insensitive)
    const allListings = await Listing.find({
      category: { $regex: new RegExp("^" + category + "$", "i") }
    });

    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

