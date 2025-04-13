const mongoose = require("mongoose");
const ExpressError = require("../utils/ExpressError");

const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ExpressError(404, "Invalid Listing ID!");
  }
  next();
};

module.exports = validateId;
