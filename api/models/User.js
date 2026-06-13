const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    // MOVED INSIDE: Define role with a default value
    role: {
      type: String,
      enum: ["user", "admin"], // Only allows these two values
      default: "user", // New sign-ups are 'user' by default
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
