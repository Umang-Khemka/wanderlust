const { listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((detail) => detail.message).join(", ");
    throw new ExpressError(400,msg);
  } else {
    next();
  }
};