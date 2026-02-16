// Import core dependencies
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');




// Initialise express app
const app = express();


// Security headers (prevents common attacks)
app.use(helmet());


// Allow frontend to send cookies
app.use(cors({
origin: 'http://localhost:3000',
credentials: true
}));


// Parse JSON bodies
app.use(express.json());


// Parse cookies from requests
app.use(cookieParser());

app.use('/api/auth', authRoutes);


// Health check route
app.get('/api/health', (req, res) => {
res.json({ status: 'API running' });
});


module.exports = app;