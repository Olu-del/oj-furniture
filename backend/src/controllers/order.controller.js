// Order controller – handles fetching orders and updating their status
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient(); // create prisma instance for database queries



// GET USER ORDERS
// returns all orders that belong to the currently logged-in user
exports.getUserOrders = async (req, res) => {
  try {

    const orders = await prisma.order.findMany({
      where: { userId: req.userId }, // only fetch orders for this user

      include: {
        orderItems: {
          include: {
            product: true // include product details for each order item
          }
        }
      },

      // newest orders appear first
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
      user: true,        // include user who placed the order
      orderItems: true   // include items inside the order
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
      where: { id: parseInt(req.params.id) }, // find order by ID
      data: { deliveryStatus } // update delivery status field
    });

    res.json(order);

  } catch (err) {

    // log error for debugging
    console.error(err);

    res.status(500).json({ message: "Failed to update delivery status" });
  }
};