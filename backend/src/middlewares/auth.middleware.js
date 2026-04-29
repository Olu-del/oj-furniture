// Authentication middleware – checks JWT and attaches user info to the request
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

  // check Authorisation header first (Bearer token)
  // if not present, fall back to cookie-based token
  let token = null;
  
  const authHeader = req.headers.authorization;

  // extract token from "Bearer <token>" format if header is present
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7); // remove "Bearer " from the start
  } else {
    token = req.cookies.token; // use cookie token if header not provided
  }

  // if no token found, user is not authenticated
  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  try {

    // verify token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user information to request object
    // this allows other routes/middleware to know who the user is
    req.userId = decoded.id;
    req.role = decoded.role; 

    // continue to next middleware or route
    next();

  } catch (err) {

    // token was invalid or expired
    return res.status(401).json({ message: 'Invalid token' });
  }
};