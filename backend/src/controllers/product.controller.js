const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new product
exports.createProduct = async (req, res) => {
  const { name, description, price, deliveryPrice } = req.body;
  if (!name || !description || !price || !deliveryPrice)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const product = await prisma.product.create({
      data: { name, description, price, deliveryPrice }
    });
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
};

// Search products by name or description
exports.searchProducts = async (req, res) => {
  const { q } = req.query;
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } }
      ]
    }
  });
  res.json(products);
};
