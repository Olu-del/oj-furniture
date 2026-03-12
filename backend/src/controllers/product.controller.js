// product controller handles CRUD operations for products, including image upload and search
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// create a new product - admin only
exports.createProduct = async (req, res) => {
   // log who is creating the product (useful for debugging/admin checks)
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

  // convert condition to uppercase for consistency
  if (condition) {
    condition = condition.toUpperCase();
  }

    // AUTO-GENERATED DESCRIPTION
    // automatically generate a more detailed description
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
            price: parseFloat(price), // convert price to number
            deliveryPrice: parseFloat(deliveryPrice),
            colour,
            condition,
            stock: stock ? Number(stock) : 0, // default stock = 0

            categoryId: Number(categoryId),
            subCategoryId: Number(subCategoryId),

              // more product details
            dimensions: dimensions || null,
            material: material || null,
            age: age ? Number(age) : null,
            sustainabilityScore: sustainabilityScore ? Number(sustainabilityScore) : null,

             // if image uploaded use it, otherwise use placeholder
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

    // returns product list with optional filters and sorting
      exports.getProducts = async (req, res) => {
        const { categoryId, subCategoryId, colour, sort } = req.query;

    // object used to build dynamic filters
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

           // sorting options
          const orderBy = {};

          if (sort === "priceLow") {
                orderBy.price = "asc";
           }

           if (sort === "priceHigh") {
                  orderBy.price = "desc";
            }

             // fetch products with their categories 
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

// for fetching multiple products (e.g. for cart/local storage)
        exports.getProductsByIds = async (req, res) => {
          const { ids } = req.body;

          // check if ids is a valid array
          if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ message: "Invalid IDs array" });
          }

          try {
            const products = await prisma.product.findMany({
              where: {
                id: { in: ids.map(Number) }, // convert ids to numbers
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

        //  UPDATE PRODUCT 
        // admin can update existing product details
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
           // keep condition consistent
        if (condition) {
          condition = condition.toUpperCase();
        }
        // regenerate description after update
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

            // reconnect category 
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



          //  DELETE PRODUCT 
          // admin deletes a product
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


          //  SEARCH PRODUCTS 
          // simple search based on product name
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
