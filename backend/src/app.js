// Import core dependencies
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth.routes');
const auth = require('./middlewares/auth.middleware');
const contactRoutes = require("./routes/contact.routes");
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require("./routes/category.routes");
const cartRoutes = require('./routes/cart.routes');
const checkoutRoutes = require('./routes/checkout.routes');
const orderRoutes = require('./routes/order.routes');
const adminRoutes = require("./routes/admin.routes");
const complaintRoutes = require("./routes/complaint.routes");
const surveyRoutes = require("./routes/survey.routes");

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ⭐ CREATE EXPRESS APP FIRST
const app = express();

// ⭐ CORS ORIGINS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3002",
  "https://oj-furniture-1.onrender.com",
  "https://oj-furniture.onrender.com",
  "https://oj-furniture-2.onrender.com"
];

// ⭐ CORS MIDDLEWARE
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

// Parse JSON
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// Serve images
const path = require("path");
app.use(
  "/images",
  express.static(path.join(__dirname, "public/images"), {
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      const reqOrigin = res.req.headers.origin;
      if (allowedOrigins.includes(reqOrigin)) {
        res.setHeader("Access-Control-Allow-Origin", reqOrigin);
      }
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }
  })
);

// API routes
app.use('/api/auth', authRoutes);
app.use("/api/contact", contactRoutes);
app.use('/api/product', productRoutes);
app.use("/api/category", categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/order', orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/survey", surveyRoutes);

// Protected route
app.get('/api/user/me', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        address: {
          select: {
            id: true,
            line1: true,
            city: true,
            postcode: true,
            country: true
          }
        }
      }
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'API running' });
});

app.get("/debug/db", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { subCategories: true }
    });

    res.json({
      status: "connected",
      categoriesCount: categories.length,
      sample: categories.slice(0, 3)
    });
  } catch (err) {
    res.json({
      status: "error",
      message: err.message
    });
  }
});


module.exports = app;
