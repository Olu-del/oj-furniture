const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getSustainabilityStats = async (req, res) => {
  try {
    const products = await prisma.product.findMany();

    const totalWasteSaved = products.reduce(
      (sum, p) => sum + (p.sustainabilityScore || 0) * 0.5,
      0
    );

    const totalCO2Saved = products.reduce(
      (sum, p) => sum + (p.sustainabilityScore || 0) * 0.3,
      0
    );

    const avgScore =
      products.reduce((sum, p) => sum + (p.sustainabilityScore || 0), 0) /
      (products.length || 1);

    res.json({
      totalWasteSaved: totalWasteSaved.toFixed(1),
      totalCO2Saved: totalCO2Saved.toFixed(1),
      avgScore: avgScore.toFixed(1),
    });
  } catch (err) {
    console.error("Sustainability stats error:", err);
    res.status(500).json({ message: "Failed to load sustainability stats" });
  }
};
