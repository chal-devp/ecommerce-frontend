const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new product (Admin tool)
router.post("/products", async (req, res) => {
  const product = new Product(req.body);
  try {
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.delete("/products/:id", async (req, res) => {
  console.log("DELETE route hit! ID is:", req.params.id); // <--- ADD THIS

  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    console.log("Deleted Product Result:", deletedProduct); // <--- ADD THIS

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully!" });
  } catch (error) {
    console.log("Error in delete route:", error); // <--- ADD THIS
    res.status(500).json({ message: error.message });
  }
});
// Quick Seed Route - Visit http://localhost:5000/api/seed to add data
router.get("/seed", async (req, res) => {
  try {
    await Product.deleteMany({}); // Clears existing products so you don't have duplicates
    const sampleProducts = [
      {
        name: "Wireless Headphones",
        description: "Noise-cancelling over-ear headphones.",
        price: 199,
        category: "Electronics",
        stock: 10,
        imageUrl:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      },
      {
        name: "Smart Watch",
        description: "Track your fitness and notifications.",
        price: 299,
        category: "Wearables",
        stock: 5,
        imageUrl:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      },
    ];
    const createdProducts = await Product.insertMany(sampleProducts);
    res.status(201).json(createdProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
