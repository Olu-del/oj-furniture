// product controller handles CRUD operations for products, including image upload and search
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// create a new product - admin only
exports.createProduct = async (req, res) => {
  // pull fields from request body
  const { name, description, price, deliveryPrice, colour, categoryId, subCategoryId } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        deliveryPrice: parseFloat(deliveryPrice),
        colour,
        categoryId: Number(categoryId),
        subCategoryId: Number(subCategoryId),
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

  // build filters based on query params
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

// Get product by ID for editing or details page
exports.getProductById = async (req, res) => {
  // validate and parse ID from route params
  const rawId = req.params.id;
  const id = Number(rawId);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching product" });
  }
};


exports.updateProduct = async (req, res) => {
  const id = Number(req.params.id);
  const {
    name,
    description,
    price,
    deliveryPrice,
    colour,
    categoryId,
    subCategoryId,
    stock
  } = req.body;

  try {
    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: parseFloat(price),
        deliveryPrice: parseFloat(deliveryPrice),
        colour,
       ...(stock !== undefined && { stock: Number(stock) }),
        //update category and subcategory associations
        category: {
          connect: { id: Number(categoryId) }
        },
        subCategory: {
          connect: { id: Number(subCategoryId) }
        },

        //Update image only if new file uploaded
        ...(req.file && { imageUrl: `/uploads/${req.file.filename}` })
      }
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update product" });
  }
};



exports.deleteProduct = async (req, res) => {
     const id = Number(req.params.id);


  try {
    await prisma.product.delete({
        where: { id }

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
          contains: q.toLowerCase()

        }
      }
    });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Search failed" });
  }
};