const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId },
       include: {
       orderItems: {
        include: {
        product: true
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

      exports.getAllOrders = async (req, res) => {
        const orders = await prisma.order.findMany({
          include: {
            user: true,
            orderItems: true
          }
        });

        res.json(orders);
};


exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  const order = await prisma.order.update({
    where: { id: parseInt(req.params.id) },
    data: { status }
  });

  res.json(order);
};



exports.updateDeliveryStatus = async (req, res) => {
  const { deliveryStatus } = req.body;

  try {
    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: { deliveryStatus }
    });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update delivery status" });
  }
};
