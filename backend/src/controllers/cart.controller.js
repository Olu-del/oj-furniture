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

  // Convert Decimal prices to numbers for the frontend and ensure product exists
  if (cart && Array.isArray(cart.items)) {
    cart.items = cart.items.map((item) => {
      const prod = item.product;
      if (prod && prod.price !== undefined && prod.price !== null) {
        // Prisma Decimal -> string, convert to number for UI calculations
        const priceNum = Number(prod.price.toString());
        return { ...item, product: { ...prod, price: priceNum } };
      }
      return item;
    });
  }

  res.json(cart);
};


exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  const pid = Number(productId);
  const qty = Number(quantity) || 1;

  let cart = await prisma.cart.findUnique({
    where: { userId: req.userId }
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: req.userId }
    });
  }

  await prisma.cartItem.upsert({
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

  res.json({ message: "Product added to cart" });
};

exports.updateCartItem = async (req, res) => {
  // Frontend sends { productId, quantity } — update by cartId+productId
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


exports.mergeCart = async (req, res) => {
  try {
    const { items } = req.body;

    let cart = await prisma.cart.findUnique({
      where: { userId: req.userId }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.userId }
      });
    }

    for (const item of items) {
      await prisma.cartItem.upsert({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: item.productId
          }
        },
        update: {
          quantity: { increment: item.quantity }
        },
        create: {
          cartId: cart.id,
          productId: item.productId,
          quantity: item.quantity
        }
      });
    }

    res.json({ message: "Cart merged" });
  } catch (err) {
    console.error("Merge cart error:", err);
    res.status(500).json({ error: "Failed to merge cart" });
  }
}


