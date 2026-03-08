
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { sendEmail } = require("../utils/email");
const { orderTemplate } = require("../utils/email.template");

exports.checkout = async (req, res) => {
  const shippingAddress = req.body.shippingAddress;

  // Validate structured address
  if (
    !shippingAddress ||
    !shippingAddress.address?.trim() ||
    !shippingAddress.line1?.trim() ||
    !shippingAddress.city?.trim() ||
    !shippingAddress.postcode?.trim() ||
    !shippingAddress.country?.trim()
  ) {
    return res.status(400).json({ message: "Invalid shipping address" });
  }

  try {
    const order = await prisma.$transaction(async (tx) => {

      // Save address if requested
      if (req.body.saveAddress) {
        await tx.address.create({
          data: {
            userId: req.userId,
           address: shippingAddress.address,
           line1: shippingAddress.line1,
           line2: shippingAddress.line2,
           city: shippingAddress.city,
           postcode: shippingAddress.postcode,
           country: shippingAddress.country

          }
        });
      }

      // Fetch cart
      const cart = await tx.cart.findUnique({
        where: { userId: req.userId },
        include: {
          items: { include: { product: true } }
        }
      });

      if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
      }

      // Build product map
      const productIds = cart.items.map(i => i.productId);
      const products = await tx.product.findMany({
        where: { id: { in: productIds } }
      });

      const productMap = new Map();
      products.forEach(p => productMap.set(p.id, p));

  

      let subtotal = 0;
      let highestDelivery = 0;

      for (const item of cart.items) {
        const product = productMap.get(item.productId);

        if (!product) throw new Error("Product no longer exists");
        if (product.stock < item.quantity)
          throw new Error(`Not enough stock for ${product.name}`);

        subtotal += Number(product.price) * item.quantity;

        // Track highest delivery price
        highestDelivery = Math.max(
          highestDelivery,
          Number(product.deliveryPrice)
        );
      }

      // Apply free delivery threshold
      let deliveryTotal = subtotal >= 50 ? 0 : highestDelivery;

      const total = subtotal + deliveryTotal;

      
      // Decrement stock
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // Create order
      const createdOrder = await tx.order.create({
        data: {
          userId: req.userId,
          subtotal,
          deliveryTotal,
          total,
          status: "PAID",
          shippingAddress: `${shippingAddress.address},
            ${shippingAddress.line1},
            ${shippingAddress.line2 || ""}, 
            ${shippingAddress.city},
            ${shippingAddress.postcode},
            ${shippingAddress.country}`,
          orderItems: {
            create: cart.items.map((item) => {
              const product = productMap.get(item.productId);
              return {
                productId: item.productId,
                name: product.name,
                imageUrl: product.imageUrl,
                quantity: item.quantity,
                price: product.price,
                deliveryPrice: product.deliveryPrice
              };
            })
          }
        },
        include: { orderItems: true }
      });

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return createdOrder;
    });

    // Send email
    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });

    if (user?.email) {
      await sendEmail({
        to: user.email,
        subject: `Order #${order.id} Confirmation`,
        html: orderTemplate(user.firstName, order)
      });
    }

    res.json({
      message: "Payment successful. Order created.",
      order
    });

  } catch (err) {
    console.error("Checkout error:", err);
    res.status(400).json({ message: err.message });
  }
};
