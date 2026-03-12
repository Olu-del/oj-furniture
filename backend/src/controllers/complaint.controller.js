const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// USER: Submit a complaint
exports.submitComplaint = async (req, res) => {
  const { orderId, type, message } = req.body;

  try {
    // Ensure user owns the order
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order || order.userId !== req.userId) {
      return res.status(403).json({ message: "You cannot complain about this order." });
    }

    const complaint = await prisma.complaint.create({
      data: {
        userId: req.userId,
        orderId,
        type,
        message
      }
    });

    res.json({ message: "Complaint submitted successfully", complaint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit complaint" });
  }
};

// ADMIN: Get all complaints
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await prisma.complaint.findMany({
      include: {
        user: true,
        order: true
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load complaints" });
  }
};

// ADMIN: Update complaint status
exports.updateComplaintStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const updated = await prisma.complaint.update({
      where: { id: parseInt(req.params.id) },
      data: { status }
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update complaint status" });
  }
};
