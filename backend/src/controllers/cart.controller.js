// Cart controller handles operations related to user shopping carts, including adding/removing items and fetching cart contents
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getCart = async (req, res) => {
  const cart = await prisma.cart.findUnique({
    where: { userId: req.userId },
    include: {
      items: {
        include: { product: true }
      }
    }
  });

  if (!cart) {
    return res.json({
      items: [],
      subtotal: 0,
      deliveryPrice: 0,
      total: 0
    });
  }

  // Convert Decimal → Number
  cart.items = cart.items.map((item) => ({
    ...item,
    product: {
      ...item.product,
      price: Number(item.product.price),
      deliveryPrice: Number(item.product.deliveryPrice)
    }
  }));

  const items = cart.items;

  // Subtotal
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Highest delivery price
  const highestDelivery = Math.max(
    ...items.map(i => i.product.deliveryPrice)
  );

  // Free delivery threshold
  const deliveryPrice = subtotal >= 50 ? 0 : highestDelivery;

  // Total
  const total = subtotal + deliveryPrice;

  res.json({
    items,
    subtotal,
    deliveryPrice,
    total
  });
};




exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const pid = Number(productId);
    const qty = Number(quantity) || 1;

    await prisma.$transaction(async (tx) => {

      const product = await tx.product.findUnique({
        where: { id: pid }
      });

      if (!product) {
        throw new Error("Product not found");
      }

    


    const cart = await prisma.cart.findUnique({
        where: { userId: req.userId },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      if (!cart) {
        cart = await tx.cart.create({
          data: { userId: req.userId }
        });
      }

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

    });

    res.json({ message: "Product added to cart" });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.mergeCart = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "Invalid cart data" });
    }

    const productIds = items.map(i => Number(i.productId));

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    const validProductIds = new Set(products.map(p => p.id));

    let cart = await prisma.cart.findUnique({
      where: { userId: req.userId }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.userId }
      });
    }

    await prisma.$transaction(async (tx) => {

      for (const item of items) {
        const pid = Number(item.productId);
        const qty = Number(item.quantity) || 1;

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


exports.updateCartItem = async (req, res) => {

  const { productId, quantity } = req.body;
  const pid = Number(productId);
  const qty = Number(quantity);

  const cart = await prisma.cart.findUnique({ where: { userId: req.userId } });
  if (!cart) return res.status(404).json({ error: "Cart not found" });

  await prisma.cartItem.updateMany({
    where: { cartId: cart.id, productId: pid },
    data: { quantity: qty }
  });

  res.json({ message: "Cart item updated" });
};

exports.removeCartItem = async (req, res) => {
  const { productId } = req.params;
  const userId = req.userId;

  // Get user's cart
  const cart = await prisma.cart.findUnique({
    where: { userId }
  });

  if (!cart) {
    return res.status(404).json({ error: "Cart not found" });
  }

  // Delete the cart item
  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
      productId: Number(productId)
    }
  });

  res.json({ message: "Product removed from cart" });
};



