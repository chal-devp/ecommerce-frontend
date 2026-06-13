const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  // The list of items the customer bought
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  // The total price of the cart
  totalAmount: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  location: {
    lat: { type: Number, required: false },
    long: { type: Number, required: false },
  },
  peymentId: {
    type: String,
    required: false,
  },
  // To track the order status (Pending, Shipped, Delivered)
  status: {
    type: String,
    default: "Pending",
  },

  // Automatically saves the exact date and time of the order
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
