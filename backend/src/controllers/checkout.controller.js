// Checkout controller – handles converting the user's cart into an order
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient(); // create prisma instance for database access

// email helpers used for sending order confirmation emails
const { sendEmail } = require("../utils/email");
const { orderTemplate } = require("../utils/email.template");


exports.checkout = async (req, res) => {

  // get shipping address from request body
  const shippingAddress = req.body.shippingAddress;

  // basic validation to make sure address fields are filled
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

    // run checkout logic inside a database transaction
    // this ensures all steps succeed together or none at all
    const order = await prisma.$transaction(async (tx) => {

      // optionally save the address to the user's address book
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

      // get the user's cart and its items
      const cart = await tx.cart.findUnique({
        where: { userId: req.userId },
        include: {
          items: { include: { product: true } }
        }
      });

      // stop checkout if cart is empty
      if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
      }


      // collect product IDs from cart items
      const productIds = cart.items.map(i => i.productId);

      // fetch latest product data from the database
      const products = await tx.product.findMany({
        where: { id: { in: productIds } }
      });

      // create a map for quick product lookup
      const productMap = new Map();
      products.forEach(p => productMap.set(p.id, p));


      let subtotal = 0;
      let highestDelivery = 0;

      // go through each cart item and calculate totals
      for (const item of cart.items) {

        const product = productMap.get(item.productId);

        // check if product still exists
        if (!product) throw new Error("Product no longer exists");

        // check if enough stock is available
        if (product.stock < item.quantity)
          throw new Error(`Not enough stock for ${product.name}`);

        // add item price to subtotal
        subtotal += Number(product.price) * item.quantity;

        // keep track of the highest delivery price
        highestDelivery = Math.max(
          highestDelivery,
          Number(product.deliveryPrice)
        );
      }

      // apply free delivery if order is £50 or more
      let deliveryTotal = subtotal >= 50 ? 0 : highestDelivery;

      // final order total
      const total = subtotal + deliveryTotal;


      // reduce product stock after purchase
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // create the order record
      const createdOrder = await tx.order.create({
        data: {
          userId: req.userId,
          subtotal,
          deliveryTotal,
          total,
          status: "PAID",

          // combine address fields into a single string
          shippingAddress: `${shippingAddress.address},
            ${shippingAddress.line1},
            ${shippingAddress.line2 || ""}, 
            ${shippingAddress.city},
            ${shippingAddress.postcode},
            ${shippingAddress.country}`,

          // create order items based on cart items
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

      // clear the cart after order is created
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return createdOrder;
    });


    // after order is created, send confirmation email
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

    // send response back to frontend
    res.json({
      message: "Payment successful. Order created.",
      order
    });

  } catch (err) {

    // log checkout errors for debugging
    console.error("Checkout error:", err);

    res.status(400).json({ message: err.message });
  }
};