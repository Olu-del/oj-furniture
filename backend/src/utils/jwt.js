// Utility functions for JWT token handling
const jwt = require('jsonwebtoken');

// Function to sign JWT token with user info
exports.signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
};
