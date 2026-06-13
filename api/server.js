require("dotenv").config();
const express = require("express");
const cors = require("cors"); // Removed the duplicate import
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Order = require("./models/order");
const User = require("./models/User");
const connectDB = require("./db");
const { parse } = require("dotenv");
const Product = require("./models/Product");
const app = express();
connectDB();

// --- 1. INITIALIZE STRIPE ---
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// --- 2. MIDDLEWARE ---
app.use(cors());
app.use(express.json());
// --- NEW: AUTHENTICATION MIDDLEWARE ---
// This checks if the user sent a valid Token before letting them see/create orders!
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Gets the token after "Bearer"
  if (!token)
    return res.status(401).json({ error: "Access Denied. No token provided." });
  jwt.verify(
    token,
    process.env.JWT_SECRET || "YOUR_SECRET_KEY",
    (err, user) => {
      if (err)
        return res.status(403).json({ error: "Invalid or expired token." });
      req.user = user; // Saves the userId to the request
      next(); // Moves on to the route
    },
  );
};

// A. STRIPE: Create Payment Intent
app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;

    /* 
      ⚠️ CRITICAL SECURITY WARNING:
      In a real app, do NOT trust the 'amount' from the frontend!
      A hacker can change the frontend code to send 'amount: 100' ($1.00) 
      and buy your whole store. 
      You should calculate the total amount HERE in the backend using your database!
    */
    if (!amount || isNaN(amount)) {
      console.log("backend error backend recived invalid amount", amount);
      return res.status(400).json({ massege: "invalid amount" });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// B. ORDERS: Save Order after Successful Payment (PROTECTED)
app.post("/api/orders", authenticateToken, async (req, res) => {
  try {
    console.log("Body received:", req.body);
    console.log("User from Token:", req.user);
    const { items, totalAmount, status } = req.body;
    // We can now link the order to the user who placed it!
    const newOrder = new Order({
      items: items,
      totalAmount: totalAmount,
      userId: req.user.userId,
      status: "pending_payment", // Added from the authenticateToken middleware
    });
    console.log("there is no error");
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

// C. ORDERS: Get All Orders (PROTECTED - Admin Only ideally)
app.get("/api/orders", authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// D. ORDERS: Update Status (PROTECTED)
app.patch("/api/orders/:id", authenticateToken, async (req, res) => {
  try {
    const { status, stripePaymentId } = req.body;
    console.log("updating Id");
    console.log("Status", req.body.status);
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: { status: status, stripePaymentId: stripePaymentId },
      },
      { new: true },
    );
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error updating status" });
  }
});

app.get("/test", (req, res) => res.send("Backend is working!"));

// E. PRODUCTS
app.use("/api", require("./routes/productRoutes"));

// --- 3. SIGNUP ROUTE ---
app.post("/api/signup", async (req, res) => {
  try {
    const { email, password, phone, role } = req.body;

    // First check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // 409 Conflict triggers the React frontend to switch to "Login" mode
      return res
        .status(409)
        .json({ error: "Email already exists! Please login." });
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // FIX: Add 'role' here so it actually gets saved to MongoDB
    const newUser = new User({
      email,
      password: hashedPassword,
      phone,
      role: role || "user", // Fallback to 'user' if not provided
    });
    const savedUser = await newUser.save();
    res
      .status(201)
      .json({ phone: savedUser.phone, message: "User created successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during signup" });
  }
});

// --- 4. LOGIN ROUTE ---
app.post("/api/login", async (req, res) => {
  // 1. Get data and clean it
  let { email, password } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const cleanEmail = email.toLowerCase().trim();
  console.log(`Checking DB for: |${cleanEmail}|`); // The | symbols help see hidden spaces

  // 2. Search using the cleaned email
  const user = await User.findOne({ email: cleanEmail });

  if (!user) {
    console.log("No user matched in Compass.");
    return res.status(400).json({ error: "User not found" });
  }

  // Compare encrypted password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Wrong password" });

  // Create a Token (JWT) - using env variable!
  // 1. Add role to the JWT token (Security)
  const token = jwt.sign(
    { userId: user._id, role: user.role }, // Include role here
    process.env.JWT_SECRET,
    { expiresIn: "24h" },
  );

  res.json({
    message: "Logged in!",
    token,
    role: user.role, // <--- This is what HhandleLogInSeccus() needs!
    email: user.email,
  });
});
app.get("/api/orders/my-orders", authenticateToken, async (req, res) => {
  try {
    const myOrders = await Order.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(myOrders);
  } catch (error) {
    res.status(500).json({ error: "error fetching order" });
  }
});
app.patch("/api/product/:id", async (req, res) => {
  try {
    const { stockChange } = req.body;
    const updatedStock = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { stock: stockChange } },
      { new: true },
    );
    res.json(updatedStock);
  } catch (error) {
    res.status.json({ "error:": error.message });
  }
});
app.patch("/api/orders/:id", async (req, res) => {
  try {
    const { location, status } = req.body;
    const updatedOrder = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: { location: location, status: status },
      },
      { new: true },
    );

    res.json(updatedOrder);
  } catch (error) {
    res.status.json({ "error:": error.message });
  }
});
// Add this block to your server.js
app.get("/", (req, res) => {
  res.send("<h1>E-commerce API is running!</h1>");
});

// --- 6. SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(5000, "0.0.0.0", () => {
  console.log("Server is open to the local network!");
});
