const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: String,
    category: {
        type: String,
        required: true,
        enum: [
            "Rooms",
            "Iconic Cities",
            "Castles",
            "Mountain Views",
            "Camping",
            "Amazing Nature",
            "Farms",
            "Arctic",
            "Boats"
        ],
        message: "Selected category is not allowed. Please choose from the provided options."
    },
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true
    },
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;