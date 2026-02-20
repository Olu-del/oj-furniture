const jwt = require('jsonwebtoken');

// Middleware to protect routes and ensure user is authenticated
module.exports = (req, res, next) => {
const token = req.cookies.token;

// Check if token exists
if (!token) return res.status(401).json({ message: 'Not authenticated' });

//Token verification
try {
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.userId = decoded.userId;
next();
} catch (err) {
return res.status(401).json({ message: 'Invalid token' });
}
};