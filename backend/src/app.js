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
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



// Initialise express app
const app = express();


// Use Helmet for security headers
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);


// Allow frontend to send cookies
app.use(cors({
origin: 'http://localhost:3000',
credentials: true
}));


// Parse JSON bodies
app.use(express.json());


// Parse cookies from requests
app.use(cookieParser());

//uploads folder for product images
app.use(
  "/uploads",
  express.static("uploads", {
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }
  })
);




// API routes
app.use('/api/auth', authRoutes);
app.use("/api/contact", contactRoutes);
app.use('/api/product', productRoutes);
app.use("/api/category", categoryRoutes);


// Protected route to get current user info
app.get('/api/user/me', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isAdmin: true,   
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
// If user not found, return 404
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
res.json({ status: 'API running' });
});


module.exports = app;