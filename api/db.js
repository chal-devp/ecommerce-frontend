const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("triyng to connect ", process.env.MONGO_URI);
  try {
    // Connect to the database using the link in our .env file
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB is Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1); // Stop the server if the database fails
  }
};

module.exports = connectDB;
