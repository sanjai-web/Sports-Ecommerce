const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

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
        // process.exit(1);
    }
};

connectDB();

// ================= ROUTES =================

// Test route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Example API route
app.get("/api/products", (req, res) => {
    const products = [
       {
    id: '1',
    name: 'ProFlex Adjustable Dumbbells 24kg',
    brand: 'ProFlex',
    category: 'Weights',
    price: 16999,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    popularity: 95
  },
  {
    id: '2',
    name: 'AeroKnit Running Shoes',
    brand: 'Velocity',
    category: 'Footwear',
    price: 10999,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    popularity: 88
  },
  {
    id: '3',
    name: 'Impact Resistance Yoga Mat',
    brand: 'Zenith',
    category: 'Accessories',
    price: 3999,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    popularity: 92
  },
  {
    id: '4',
    name: 'MaxBurn Protein Powder - Chocolate',
    brand: 'NutriMax',
    category: 'Supplements',
    price: 4999,
    discount: 5,
    image: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    popularity: 98
  },
  {
    id: '5',
    name: 'Elite Core Ab Roller',
    brand: 'ProFlex',
    category: 'Equipment',
    price: 1999,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    popularity: 75
  },
  {
    id: '6',
    name: 'HydroFlask Stainless Steel Bottle 32oz',
    brand: 'Hydro',
    category: 'Accessories',
    price: 3499,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    popularity: 85
  },
  {
    id: '7',
    name: 'PowerGrip Kettlebell 16kg',
    brand: 'ProFlex',
    category: 'Weights',
    price: 8499,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    popularity: 87
  },
  {
    id: '8',
    name: 'SpeedMax Jump Rope',
    brand: 'Velocity',
    category: 'Equipment',
    price: 1299,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    popularity: 80
  },
  {
    id: '9',
    name: 'FlexBand Resistance Set (5 Levels)',
    brand: 'Zenith',
    category: 'Equipment',
    price: 2499,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a08?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    popularity: 91
  },
  {
    id: '10',
    name: 'ProForm Treadmill T7.0',
    brand: 'ProForm',
    category: 'Cardio',
    price: 74999,
    discount: 8,
    image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    popularity: 93
  },
  {
    id: '11',
    name: 'AirGlide Cycling Shoes',
    brand: 'Velocity',
    category: 'Footwear',
    price: 7999,
    discount: 12,
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    popularity: 79
  },
  {
    id: '12',
    name: 'DryFit Performance T-Shirt',
    brand: 'ActiveEdge',
    category: 'Apparel',
    price: 1999,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    popularity: 82
  },
  {
    id: '13',
    name: 'FlexCore Compression Shorts',
    brand: 'ActiveEdge',
    category: 'Apparel',
    price: 1699,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    popularity: 76
  },
  {
    id: '14',
    name: 'BCAA Energy Drink Mix - Berry Blast',
    brand: 'NutriMax',
    category: 'Supplements',
    price: 2999,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1622479457928-4b7ff5a89c3c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    popularity: 89
  },
  {
    id: '15',
    name: 'IronGrip Weightlifting Belt',
    brand: 'ProFlex',
    category: 'Accessories',
    price: 3299,
    discount: 5,
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    popularity: 83
  },
  {
    id: '16',
    name: 'Olympic Barbell 20kg Set',
    brand: 'ProFlex',
    category: 'Weights',
    price: 22999,
    discount: 18,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    popularity: 90
  },
  {
    id: '17',
    name: 'Stationary Exercise Bike - Smart Series',
    brand: 'ProForm',
    category: 'Cardio',
    price: 32999,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    popularity: 86
  },
  {
    id: '18',
    name: 'PureWhey Isolate Protein - Vanilla',
    brand: 'NutriMax',
    category: 'Supplements',
    price: 5999,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    popularity: 96
  },
  {
    id: '19',
    name: 'CloudStep Training Sneakers',
    brand: 'Velocity',
    category: 'Footwear',
    price: 8499,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    popularity: 94
  },
  {
    id: '20',
    name: 'Pull-Up & Dip Bar Station',
    brand: 'Zenith',
    category: 'Equipment',
    price: 12999,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    popularity: 88
  },
    ];

    res.json(products);
});



// ================= ERROR HANDLING =================
app.use((req, res, next) => {
    res.status(404).json({ message: "Route Not Found" });
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});