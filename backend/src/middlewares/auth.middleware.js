// simple JWT check and attach user info
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // check Authorisation header first (Bearer token), then fall back to cookies
  let token = null;
  
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else {
    token = req.cookies.token;
  }

  
  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.role = decoded.role; 
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};