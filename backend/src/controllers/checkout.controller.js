const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


exports.checkout = async (req, res) => {
  const { shippingAddress } = req.body;

  try {
    const order = await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId: req.userId },
        include: {
          items: { include: { product: true } }
        }
      });

      if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
      }

      let total = 0;

      for (const item of cart.items) {
        if (item.product.stock < item.quantity) {
          throw new Error(
            `Not enough stock for ${item.product.name}`
          );
        }

        total += Number(item.product.price) * item.quantity;

        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity }
          }
        });
      }

      const order = await tx.order.create({
        data: {
          userId: req.userId,
          total,
          status: "PAID", // fake payment success
          shippingAddress,
          orderItems: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price
            }))
          }
        },
        include: { orderItems: true }
      });

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return order;
    });

    res.json({
      message: "Payment successful. Order created.",
      order
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};