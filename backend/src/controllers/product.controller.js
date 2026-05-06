const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// CREATE PRODUCT
exports.createProduct = async (req, res) => {
  console.log('createProduct called by', req.userId, req.role);

  let {
    name,
    description,
    price,
    deliveryPrice,
    colour,
    condition,
    categoryId,
    subCategoryId,
    stock,
    dimensions,
    material,
    age,
    sustainabilityScore
  } = req.body;

  if (condition) condition = condition.toUpperCase();

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        deliveryPrice: parseFloat(deliveryPrice),
        colour,
        condition,
        stock: stock ? Number(stock) : 0,

        categoryId: Number(categoryId),
        subCategoryId: Number(subCategoryId),

        dimensions: dimensions || null,
        material: material || null,
        age: age ? Number(age) : null,
        sustainabilityScore: sustainabilityScore ? Number(sustainabilityScore) : null,

        imageUrl: req.file
          ? `/images/${req.file.filename}`
          : "/images/placeholder.png"
      }
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", details: err.message });
  }
};

// GET PRODUCTS (SAFE)
exports.getProducts = async (req, res) => {
  const { categoryId, subCategoryId, colour, sort } = req.query;

  const where = {};

  if (categoryId) where.categoryId = Number(categoryId);
  if (subCategoryId) where.subCategoryId = Number(subCategoryId);
  if (colour) where.colour = colour;

  const orderBy = {};
  if (sort === "priceLow") orderBy.price = "asc";
  if (sort === "priceHigh") orderBy.price = "desc";

  try {
    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true,
        subCategory: true
      }
    });

    res.json(Array.isArray(products) ? products : []);
  } catch (err) {
    console.error(err);
    res.json([]);
  }
};

// GET PRODUCTS BY IDS
exports.getProductsByIds = async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({ message: "Invalid IDs array" });
  }

  try {
    const products = await prisma.product.findMany({
      where: { id: { in: ids.map(Number) } }
    });

    res.json(Array.isArray(products) ? products : []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET PRODUCT BY ID
exports.getProductById = async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching product" });
  }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  const id = Number(req.params.id);

  let {
    name,
    description,
    price,
    deliveryPrice,
    colour,
    condition,
    categoryId,
    subCategoryId,
    stock,
    dimensions,
    material,
    age,
    sustainabilityScore
  } = req.body;

  if (condition) condition = condition.toUpperCase();

  try {
    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: parseFloat(price),
        deliveryPrice: parseFloat(deliveryPrice),
        colour,
        condition,
        stock: stock ? Number(stock) : 0,

        dimensions: dimensions || null,
        material: material || null,
        age: age ? Number(age) : null,
        sustainabilityScore: sustainabilityScore ? Number(sustainabilityScore) : null,

        category: { connect: { id: Number(categoryId) } },
        subCategory: { connect: { id: Number(subCategoryId) } },

        ...(req.file && { imageUrl: `/images/${req.file.filename}` })
      }
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update product" });
  }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.cartItem.deleteMany({ where: { productId: id } });
    await prisma.orderItem.deleteMany({ where: { productId: id } });

    await prisma.product.delete({ where: { id } });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

// SEARCH PRODUCTS
exports.searchProducts = async (req, res) => {
  const { q } = req.query;

  try {
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: q.toLowerCase()
        }
      }
    });

    res.json(Array.isArray(products) ? products : []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Search failed" });
  }
};
