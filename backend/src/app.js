// Import core dependencies
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const auth = require('./middlewares/auth.middleware');
const contactRoutes = require("./routes/contact.routes");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



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


// API routes
app.use('/api/auth', authRoutes);
app.use("/api/contact", contactRoutes);


//Protected route 
app.get('/api/user/me', auth, async (req, res) => { 
    const user = await prisma.user.findUnique({ 
        where: { id: req.userId }, 
        select: { 
            id: true, 
            firstName: true, 
            lastName: true, 
            email: true,
            address: true
        } }); 
        res.json(user);
     });


// Health check route
app.get('/api/health', (req, res) => {
res.json({ status: 'API running' });
});


module.exports = app;