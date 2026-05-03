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
// Prisma client used for database access in route handlers
const prisma = new PrismaClient();



// Initialise express app
const app = express();


// Use Helmet for security headers
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);


// Allow frontend to send cookies from either development port
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3002'];
app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin 
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


// Parse JSON bodies
app.use(express.json());


// Parse cookies from requests
app.use(cookieParser());

// Serve uploaded images with proper CORS headers
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

          // Send back the authenticated user's profile data
          res.json(user);
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: "Server error" });
        }
      });



      // Health check route
      app.get('/api/health', (req, res) => {
      // Simple service health check
      res.json({ status: 'API running' });
      });

  

  // Export app for use in server.js
  module.exports = app;