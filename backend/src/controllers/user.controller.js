// User controller – handles user profile related endpoints
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient(); // create prisma instance for database access
const jwt = require("jsonwebtoken"); // used to verify JWT authentication tokens



//  GET CURRENT USER 
// returns the currently logged-in user's details using the JWT token
exports.getMe = async (req, res) => {
  try {

    // read token from cookies
    const token = req.cookies.token;

    // if no token exists, user is not logged in
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // verify token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find user in the database using the ID stored in the token
    const user = await prisma.user.findUnique({
      where: { id: decoded.userid },

      // only return selected fields (avoid sending sensitive info like password)
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        address: true,
        role: true
      }
    });

    // if user record doesn't exist
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // send user data back to the frontend
    res.json(user);

  } catch (err) {

    // log errors for debugging
    console.error(err);

    res.status(500).json({ message: "Server error" });
  }
};
