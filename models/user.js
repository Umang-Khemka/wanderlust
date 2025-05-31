const { ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing" 
    }]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',userSchema);

