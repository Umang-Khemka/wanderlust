const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB");
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});

    // Map initData to include owner and category field (single string)
    const modifiedData = initData.data.map((obj) => ({
      ...obj,
      owner: "6807cccfd9e1c4ebb39f5c22",  // Your owner id here
      category: obj.category || "Rooms"    // Default to "Rooms" if missing
    }));

    await Listing.insertMany(modifiedData);
    console.log("Data was initialized with single categories.");
  } catch (error) {
    console.error("Error initializing DB:", error);
  } finally {
    mongoose.connection.close();
  }
};

main()
  .then(() => initDB())
  .catch((err) => console.error("Failed to connect to DB:", err));
