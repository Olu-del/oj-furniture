exports.getUserOrders = async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.userId },
    include: { orderItems: true }
  });

  res.json(orders);
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