// product controller handles CRUD operations for products, including image upload and search
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// create a new product - admin only
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

  if (condition) {
    condition = condition.toUpperCase();
  }

  // AUTO-GENERATED DESCRIPTION
  const generatedDescription = `
${name} in ${condition?.replace(/_/g, " ").toLowerCase()} condition.
Made from ${material || "unknown material"}, approximately ${age || "unknown"} years old.
Dimensions: ${dimensions || "not provided"}.
${description}
  `.trim();

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description: generatedDescription,
        price: parseFloat(price),
        deliveryPrice: parseFloat(deliveryPrice),
        colour,
        condition,
        stock: stock ? Number(stock) : 0,
        categoryId: Number(categoryId),
        subCategoryId: Number(subCategoryId),

        // NEW FIELDS
        dimensions: dimensions || null,
        material: material || null,
        age: age ? Number(age) : null,
        sustainabilityScore: sustainabilityScore ? Number(sustainabilityScore) : null,

        imageUrl: req.file
          ? `/uploads/${req.file.filename}`
          : "https://via.placeholder.com/300x300?text=No+Image"
      }
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", details: err.message });
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


        exports.getProductsByIds = async (req, res) => {
          const { ids } = req.body;

          if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ message: "Invalid IDs array" });
          }

          try {
            const products = await prisma.product.findMany({
              where: {
                id: { in: ids.map(Number) },
              },
            });

            res.json(products);
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
          }
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

  if (condition) {
    condition = condition.toUpperCase();
  }

  const updatedDescription = `
${name} in ${condition?.replace(/_/g, " ").toLowerCase()} condition.
Made from ${material || "unknown material"}, approximately ${age || "unknown"} years old.
Dimensions: ${dimensions || "not provided"}.
${description}
  `.trim();

  try {
    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        description: updatedDescription,
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
              // remove any cart items referencing this product first
              await prisma.cartItem.deleteMany({ where: { productId: id } });
              // also clear order items if any exist
              await prisma.orderItem.deleteMany({ where: { productId: id } });

              await prisma.product.delete({ where: { id } });

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
