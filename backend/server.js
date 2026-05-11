require("node:dns/promises").setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Product = require("./models/Product");

// Load env variables
dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// ================= DATABASE CONNECTION =================

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB Connection Error:", error.message);
  }
};

connectDB();

// ================= ROUTES =================

// Test Route
app.get("/", (req, res) => {
  res.send("API Running...");
});

// ================= SIGNUP =================

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, mobile, address, password } = req.body;

    // Check existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check first user => admin
    const usersCount = await User.countDocuments();

    const newUser = new User({
      name,
      email,
      mobile,
      address,
      password: hashedPassword,
      role: usersCount === 0 ? "admin" : "user",
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Account created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// ================= LOGIN =================

app.post("/api/auth/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Find user using email or mobile
    const user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// ================= UPDATE USER PROFILE =================

app.put("/api/auth/update-profile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mobile, address } = req.body;

    // Find user
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check mobile already used by another user
    const mobileExists = await User.findOne({
      mobile,
      _id: { $ne: id },
    });

    if (mobileExists) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already exists",
      });
    }

    // Update details
    user.name = name;
    user.mobile = mobile;
    user.address = address;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// ================= PRODUCTS CRUD =================

// GET all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// GET single product
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// ADD new product (Admin only - you can add middleware later)
app.post("/api/products", async (req, res) => {
  try {
    const { name, brand, category, price, discount, image, popularity } = req.body;

    const newProduct = new Product({
      name,
      brand,
      category,
      price,
      discount: discount || 0,
      image,
      popularity: popularity || 0,
      hidden: false,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// UPDATE product
app.put("/api/products/:id", async (req, res) => {
  try {
    const { name, brand, category, price, discount, image, popularity, hidden } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.name = name || product.name;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.price = price || product.price;
    product.discount = discount !== undefined ? discount : product.discount;
    product.image = image || product.image;
    product.popularity = popularity !== undefined ? popularity : product.popularity;
    product.hidden = hidden !== undefined ? hidden : product.hidden;

    await product.save();

    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// DELETE product
app.delete("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});



// ================= GET ALL USERS (Admin) =================

app.get("/api/auth/users", async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      success: true,
      users: users.map(u => ({
        id: u._id,
        name: u.name,
        email: u.email,
        mobile: u.mobile,
        address: u.address,
        role: u.role,
        createdAt: u.createdAt
      }))
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// ================= UPDATE USER ROLE (Admin) =================

app.put("/api/auth/update-role/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: "User role updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});



// ================= ERROR HANDLING =================

app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found",
  });
});

// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});