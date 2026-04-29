const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { sendEmail } = require("../utils/email");
const { complaintReceivedTemplate, complaintStatusTemplate } = require("../utils/email.template");

// Controller for handling user complaints about orders
exports.submitComplaint = async (req, res) => {
  const { orderId, message, type } = req.body;  // ⭐ include type

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true }
    });

    if (!order || order.userId !== req.userId) {
      return res.status(403).json({ message: "You cannot complain about this order." });
    }

    if (order.deliveryDate && order.deliveryDate > new Date()) {
      return res.status(400).json({
        message: "You cannot report an issue before your order is delivered."
      });
    }

    if (order.deliveryStatus !== "DELIVERED") {
      return res.status(400).json({
        message: "Complaints cannot be allowed before delivery."
      });
    }

    const complaint = await prisma.complaint.create({
      data: {
        userId: req.userId,
        orderId,
        message,
        type   //  save complaint reason
      }
    });

    await sendEmail({
      to: order.user.email,
      subject: "Complaint Received",
      html: complaintReceivedTemplate(order.user.firstName, orderId)
    });

    res.json({ message: "Complaint submitted successfully", complaint });

  } catch (err) {
    console.error(err.message);
    res.status(400).json({ message: err.message });
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
    const complaint = await prisma.complaint.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
      include: {
        user: true,
        order: true
      }
    });

    // Choose subject line
    const subjects = {
      OPEN: "Your Complaint Has Been Reopened",
      IN_REVIEW: "Your Complaint is Being Reviewed",
      RESOLVED: "Your Complaint Has Been Resolved",
      REJECTED: "Your Complaint Has Been Rejected"
    };

    const subject = subjects[complaint.status] || "Complaint Update";

    // Send email to user
    await sendEmail({
      to: complaint.user.email,
      subject,
      html: complaintStatusTemplate(complaint.user.firstName, complaint)
    });

    res.json(complaint);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update complaint status" });
  }
};

