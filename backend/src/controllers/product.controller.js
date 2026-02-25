const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new product
exports.createProduct = async (req, res) => {
  const { name, description, price, deliveryPrice } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        deliveryPrice: parseFloat(deliveryPrice),
        imageUrl: req.file ? `/uploads/${req.file.filename}` : null

      }
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



exports.getProducts = async (req, res) => {
  const { categoryId, subCategoryId, colour, sort } = req.query;

  const where = {};

  if (categoryId) {
    where.categoryId = Number(categoryId);
  }

  if (subCategoryId) {
    where.subCategoryId = Number(subCategoryId);
  }

  if (colour) {
    where.colour = colour;
  }

  const orderBy = {};

  if (sort === "priceLow") {
    orderBy.price = "asc";
  }

  if (sort === "priceHigh") {
    orderBy.price = "desc";
  }

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      category: true,
      subCategory: true
    }
  });

  res.json(products);
};


exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, deliveryPrice, stock } = req.body;

  try {
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price: parseFloat(price),
        deliveryPrice: parseFloat(deliveryPrice),
        stock: parseInt(stock)
      }
    });

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update product" });
  }
};



exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete product" });
  }
};



exports.searchProducts = async (req, res) => {
  const { q } = req.query;

  try {
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: q,
          mode: "insensitive"
        }
      }
    });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Search failed" });
  }
};