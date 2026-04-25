// Order controller – handles fetching orders and updating their status
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient(); // create prisma instance for database queries
const { sendEmail } = require("../utils/email");
const { 
  orderOutForDeliveryTemplate,
  orderDeliveredTemplate
} = require("../utils/email.template");


// GET USER ORDERS
// returns all orders that belong to the currently logged-in user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId },
      include: {
        orderItems: {
          select: {
            id: true,
            productId: true,
            name: true,
            imageUrl: true,
            quantity: true,
            price: true,
            deliveryPrice: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(orders);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};




// GET ALL ORDERS 
// used by admin to view every order in the system
exports.getAllOrders = async (req, res) => {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      orderItems: {
        select: {
          id: true,
          productId: true,
          name: true,
          imageUrl: true,
          quantity: true,
          price: true,
          deliveryPrice: true
        }
      }
    }
  });

  res.json(orders);
};




//  UPDATE ORDER STATUS 
// allows admin to update order state (e.g. PAID, CANCELLED, etc.)
exports.updateOrderStatus = async (req, res) => {

  const { status } = req.body;

  const order = await prisma.order.update({
    where: { id: parseInt(req.params.id) }, // get order ID from route
    data: { status } // update order status
  });

  res.json(order);
};



//  UPDATE DELIVERY STATUS 
// updates delivery progress (e.g. processing, shipped, delivered)
exports.updateDeliveryStatus = async (req, res) => {
  const { deliveryStatus } = req.body;

  try {
    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: { deliveryStatus },
      include: {
        user: true,
        orderItems: true   
      }
    });

    // Get first product name for email subject
    // const firstItemName = order.orderItems[0]?.name || `Order #${order.id}`;
      const firstItemName = order.orderItems[0]?.name || "Your Purchase";


    // Send email BEFORE sending response
    if (deliveryStatus === "OUT_FOR_DELIVERY") {
      await sendEmail({
        to: order.user.email,
        subject: `${firstItemName} is Out for Delivery`,
        html: orderOutForDeliveryTemplate(order.user.firstName, order)
      });
    }

    if (deliveryStatus === "DELIVERED") {
      await sendEmail({
        to: order.user.email,
        subject: `${firstItemName} has been delivered`,
        html: orderDeliveredTemplate(order.user.firstName, order)
      });
    }

    // Now send response
    res.json(order);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to update delivery status" });
  }
};

// exports.updateDeliveryStatus = async (req, res) => {
//   const { deliveryStatus } = req.body;

//   try {
//     const order = await prisma.order.update({
//       where: { id: parseInt(req.params.id) },
//       data: { deliveryStatus },
//       include: { user: true } // IMPORTANT
//     });

//     // Send email BEFORE sending response
//     if (deliveryStatus === "OUT_FOR_DELIVERY") {
//       await sendEmail({
//         to: order.user.email,
//         subject: `Order #${order.id} is Out for Delivery`,
//         html: orderOutForDeliveryTemplate(order.user.firstName, order)
//       });
//     }

//     if (deliveryStatus === "DELIVERED") {
//       await sendEmail({
//         to: order.user.email,
//         subject: `Order #${order.id} Delivered`,
//         html: orderDeliveredTemplate(order.user.firstName, order)
//       });
//     }

//     // Now send response
//     res.json(order);

//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ message: "Failed to update delivery status" });
//   }
// };
