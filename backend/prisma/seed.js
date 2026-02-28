//seed script to populate category data
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const bedroom = await prisma.category.create({
    data: {
      name: "Bedroom furniture",
      subCategories: {
        create: [
          { name: "Wardrobes" },
          { name: "Chest of drawers" },
          { name: "Bedside tables" }
        ]
      }
    }
  });

  const living = await prisma.category.create({
    data: {
      name: "Living room furniture",
      subCategories: {
        create: [
          { name: "Sofas" },
          { name: "Sofa beds" },
          { name: "Sideboard" },
          { name: "Sofa sets" },
          { name: "TV units and stands" },
          { name: "Bookcases" }
        ]
      }
    }
  });

  const office = await prisma.category.create({
    data: {
      name: "Office furniture",
      subCategories: {
        create: [
          { name: "Office chairs" },
          { name: "Desks" }
        ]
      }
    }
  });

  const dining = await prisma.category.create({
    data: {
      name: "Dining room furniture",
      subCategories: {
        create: [
          { name: "Dining tables" },
          { name: "Dining chairs" },
          { name: "Dining table and chair sets" }
        ]
      }
    }
  });
}

main().finally(() => prisma.$disconnect());