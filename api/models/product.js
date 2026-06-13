const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
  },
  description: {
    type: String,
    // CHANGE: Required is now false so your form works without it
    required: false,
    default: "No description provided.",
  },
  price: {
    type: Number,
    required: [true, "Please enter product price"],
  },
  category: {
    type: String,
    required: [true, "Please enter product category"],
  },
  stock: {
    type: Number,
    // CHANGE: Required is now false because your form doesn't have a stock input
    required: false,
    default: 1,
  },
  imageUrl: {
    type: String,
    required: [true, "Please provide an image URL"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema, "products");
