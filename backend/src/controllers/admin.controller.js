// Import Prisma client so we can access the database
const { PrismaClient } = require("@prisma/client");
// Create a Prisma instance
const prisma = new PrismaClient();


// function to get sustainability statistics
exports.getSustainabilityStats = async (req, res) => {
  try {
    // Get all products from the database
    const products = await prisma.product.findMany();

    // calculate total waste saved
    // using sustainabilityScore * 0.5 as an estimate
    const totalWasteSaved = products.reduce(
      (sum, p) => sum + (p.sustainabilityScore || 0) * 0.5, // if score is null use 0
      0
    );

     // calculate estimated CO2 saved
    const totalCO2Saved = products.reduce(
      (sum, p) => sum + (p.sustainabilityScore || 0) * 0.3, 
      0
    );

// work out the average sustainability score
    const avgScore =
      products.reduce((sum, p) => sum + (p.sustainabilityScore || 0), 0) / // add up all scores
      (products.length || 1); // prevent divide by 0

 // send the results back
    res.json({
      totalWasteSaved: totalWasteSaved.toFixed(1), // keep numbers to 1 decimal place
      totalCO2Saved: totalCO2Saved.toFixed(1),
      avgScore: avgScore.toFixed(1),
    });
  } catch (err) {
    // log error in case something breaks
    console.error("Sustainability stats error:", err);

  // Return server error
    res.status(500).json({ message: "Failed to load sustainability stats" });
  }
};
