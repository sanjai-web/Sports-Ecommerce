require("node:dns/promises").setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

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

// ================= PRODUCTS =================

app.get("/api/products", (req, res) => {
  const products = [
    {
      id: "1",
      name: "ProFlex Adjustable Dumbbells 24kg",
      brand: "ProFlex",
      category: "Weights",
      price: 16999,
      discount: 15,
      image:
        "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      popularity: 95,
    },
  ];

  res.json(products);
});

// ================= ERROR HANDLING =================

app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found",
  });
});

// ================= SERVER =================

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});