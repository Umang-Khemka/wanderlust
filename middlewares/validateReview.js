const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema } = require("../schema.js");

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((detail) => detail.message).join(", ");
      throw new ExpressError(400,msg);
    } else {
      next();
    }
  };