require('dotenv').config();

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // ---------- CREATE ADMIN ----------
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

  await prisma.user.upsert({
    where: { email: "ojfurniture2026@gmail.com" },
    update: {},
    create: {
      firstName: "System",
      lastName: "Admin",
      email: "ojfurniture2026@gmail.com",
      password: hashedPassword,
      role: "ADMIN"
    }
  });

  // ---------- CATEGORIES ----------
  await prisma.category.upsert({
    where: { name: "Bedroom furniture" },
    update: {},
    create: {
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

  await prisma.category.upsert({
    where: { name: "Living room furniture" },
    update: {},
    create: {
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

  await prisma.category.upsert({
    where: { name: "Office furniture" },
    update: {},
    create: {
      name: "Office furniture",
      subCategories: {
        create: [
          { name: "Office chairs" },
          { name: "Desks" }
        ]
      }
    }
  });

  await prisma.category.upsert({
    where: { name: "Dining room furniture" },
    update: {},
    create: {
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

    console.log("Database seeded successfully");

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
