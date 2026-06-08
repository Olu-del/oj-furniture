// Cart controller – handles things like getting the cart, adding items, updating quantities, etc.
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); // create prisma instance to talk to the database


//  GET CART 
// returns the user's current cart with totals
exports.getCart = async (req, res) => {

  // find the cart that belongs to the logged-in user
  let cart = await prisma.cart.findUnique({
    where: { userId: req.userId },
    include: {
      items: {
        include: { product: true } // also load the product details for each item
      }
    }
  });


  // if the user doesn't have a cart yet, return an empty one
  if (!cart) {
    return res.json({
      items: [],
      subtotal: 0,
      deliveryPrice: 0,
      total: 0
    });
  }


  // Prisma returns Decimal values for price, so convert them to normal numbers
  cart.items = cart.items.map((item) => ({
    ...item,
    product: {
      ...item.product,
      price: Number(item.product.price),
      deliveryPrice: Number(item.product.deliveryPrice)
    }
  }));


  const items = cart.items;

  // calculate subtotal (price * quantity for each item)
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // find the highest delivery price among the items
  const highestDelivery = Math.max(
    ...items.map(i => i.product.deliveryPrice)
  );

  // free delivery if subtotal is £50 or more
  const deliveryPrice = subtotal >= 50 ? 0 : highestDelivery;

  // final total
  const total = subtotal + deliveryPrice;

  res.json({
    items,
    subtotal,
    deliveryPrice,
    total
  });
};




//  ADD TO CART 
// adds a product to the user's cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const pid = Number(productId);
    const qty = Number(quantity) || 1;

    await prisma.$transaction(async (tx) => {

      // 1. Fetch product
      const product = await tx.product.findUnique({
        where: { id: pid }
      });

      if (!product) throw new Error("Product not found");

      // 2. Check stock availability
      if (product.stock === 0) {
        throw new Error(`${product.name} is out of stock`);
      }

      // 3. Get user's cart
      let cart = await tx.cart.findUnique({
        where: { userId: req.userId },
        include: { items: true }
      });

      if (!cart) {
        cart = await tx.cart.create({
          data: { userId: req.userId }
        });
      }

      // 4. Check if item already exists in cart
      const existingItem = await tx.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: pid
          }
        }
      });

      const newQuantity = existingItem
        ? existingItem.quantity + qty
        : qty;

      // 5. Prevent adding more than stock
      if (newQuantity > product.stock) {
        throw new Error(
          `Only ${product.stock} left in stock for ${product.name}`
        );
      }

      // 6. Upsert item
      await tx.cartItem.upsert({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: pid
          }
        },
        update: { quantity: newQuantity },
        create: {
          cartId: cart.id,
          productId: pid,
          quantity: qty
        }
      });

    });

    res.json({ message: "Product added to cart" });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};





//  MERGE CART 
// used when a guest user logs in and their local cart needs to merge with their account cart
exports.mergeCart = async (req, res) => {
  try {

    const { items } = req.body;

    // make sure items is an array
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "Invalid cart data" });
    }

    // collect all product IDs
    const productIds = items.map(i => Number(i.productId));

    // fetch products that actually exist
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    // store valid product IDs in a set for quick checking
    const validProductIds = new Set(products.map(p => p.id));

    // find the user's cart
    let cart = await prisma.cart.findUnique({
      where: { userId: req.userId }
    });

    // create a cart if they don't have one
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.userId }
      });
    }

    // merge items into the user's cart
    await prisma.$transaction(async (tx) => {

      for (const item of items) {

        const pid = Number(item.productId);
        const qty = Number(item.quantity) || 1;

        // skip if product doesn't exist
        if (!validProductIds.has(pid)) continue;

        await tx.cartItem.upsert({
          where: {
            cartId_productId: {
              cartId: cart.id,
              productId: pid
            }
          },
          update: {
            quantity: { increment: qty }
          },
          create: {
            cartId: cart.id,
            productId: pid,
            quantity: qty
          }
        });
      }

    });

    res.json({ message: "Cart merged successfully" });

  } catch (err) {
    console.error("Merge cart error:", err);
    res.status(500).json({ error: "Failed to merge cart" });
  }
};




//  UPDATE CART ITEM 
// updates the quantity of a product already in the cart
exports.updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  const pid = Number(productId);
  const qty = Number(quantity);
  if (!qty || qty < 1 || isNaN(qty)) {
  return res.status(400).json({ error: "Invalid quantity" });
}
  const cart = await prisma.cart.findUnique({ where: { userId: req.userId } });
  if (!cart) return res.status(404).json({ error: "Cart not found" });

  // Fetch product stock
  const product = await prisma.product.findUnique({
    where: { id: pid }
  });

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Prevent exceeding stock
  if (qty > product.stock) {
    return res.status(400).json({
      error: `Only ${product.stock} left in stock for ${product.name}`
    });
  }

  await prisma.cartItem.updateMany({
    where: { cartId: cart.id, productId: pid },
    data: { quantity: qty }
  });

  res.json({ message: "Cart item updated" });
};




//  REMOVE CART ITEM 
// removes a product completely from the cart
exports.removeCartItem = async (req, res) => {

  const { productId } = req.params;
  const userId = req.userId;

  // get user's cart
  const cart = await prisma.cart.findUnique({
    where: { userId }
  });

  if (!cart) {
    return res.status(404).json({ error: "Cart not found" });
  }

  // delete the item from the cart
  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
      productId: Number(productId)
    }
  });

  res.json({ message: "Product removed from cart" });
};

