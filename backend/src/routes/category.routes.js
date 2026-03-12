const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all categories with subcategories
router.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subCategories: true
      }
    });

    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

module.exports = router;