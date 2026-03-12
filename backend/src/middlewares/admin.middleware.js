// Middleware to check if the current user has ADMIN permissions

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); // prisma instance for database queries

module.exports = async (req, res, next) => {
  try {

    // find the user in the database using the ID from authentication middleware
    const user = await prisma.user.findUnique({ where: { id: req.userId } });

    // if user doesn't exist or their role isn't ADMIN, block access
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // if user is an admin, allow the request to continue
    next();

  } catch (err) {

    // log error for debugging
    console.error(err);

    res.status(500).json({ message: 'Server error' });
  }
};