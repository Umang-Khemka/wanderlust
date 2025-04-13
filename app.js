const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

// MongoDB connection URL
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
exports.MONGO_URL = MONGO_URL;

async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("Mongo Error:", err));

// View engine setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Root route
app.get("/", (req, res) => {
  res.send("Connection successful");
});




app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);




// Fallback Route
app.use((req, res, next) => {
  throw new ExpressError(404, "Page Not Found!");
});

// Global Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// Server Start
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
