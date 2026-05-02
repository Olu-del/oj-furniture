const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


// CREATE SURVEY
exports.createSurvey = async (req, res) => {
  try {
    const { rating, ease, comments } = req.body;

    const orderId = parseInt(req.body.orderId);
    const userId = req.userId;

    if (isNaN(orderId)) {
      return res.status(400).json({ message: "Invalid orderId" });
    }

    // ✅ FETCH ORDER FIRST (THIS WAS MISSING)
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: userId
      }
    });

    if (!order) {
      return res.status(403).json({
        message: "You cannot review this order"
      });
    }

    // Ensure order is delivered
    if (order.deliveryStatus !== "DELIVERED") {
      return res.status(400).json({
        message: "You can only review delivered orders"
      });
    }

    const survey = await prisma.survey.create({
      data: {
        orderId,
        userId,
        rating,
        ease,
        comments
      }
    });

    res.json(survey);

  } catch (err) {
    if (err.code === "P2002") {
      return res.status(400).json({
        message: "Survey already submitted for this order"
      });
    }

    console.error(err);
    res.status(500).json({
      message: "Failed to submit survey"
    });
  }
};


// GET SURVEY FOR A SPECIFIC ORDER
exports.getSurveyByOrder = async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId); // 🔥 FIX HERE

     if (!Number.isInteger(orderId)) {
  return res.status(400).json({ message: "Invalid orderId" });
}

    const survey = await prisma.survey.findFirst({
      where: {
        userId: req.userId,
        orderId: orderId
        
      }
    });

    res.json(survey);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch survey"
    });
  }
};



// (OPTIONAL) ADMIN: GET ALL SURVEYS
exports.getAllSurveys = async (req, res) => {
  try {
    const surveys = await prisma.survey.findMany({
      include: {
        user: {
          select: { id: true, email: true }
        },
        order: {
          select: { id: true, total: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(surveys);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch surveys"
    });
  }
};