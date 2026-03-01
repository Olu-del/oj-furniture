const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Ensure categories exist
  let cat = await prisma.category.findFirst({
    where: { name: "Living room furniture" }
  });
  
  if (!cat) {
    cat = await prisma.category.create({
      data: {
        name: "Living room furniture",
        subCategories: {
          create: [{ name: "Sofas" }]
        }
      }
    });
  }

  let subCat = await prisma.subCategory.findFirst({
    where: { name: "Sofas" }
  });

  // Create a test product
  const product = await prisma.product.create({
    data: {
      name: "Test Sofa",
      description: "A test sofa for checkout testing",
      categoryId: cat.id,
      subCategoryId: subCat.id,
      colour: "Red",
      price: 299.99,
      deliveryPrice: 50,
      imageUrl: "https://via.placeholder.com/300x300?text=Sofa",
      stock: 10,
      condition: "NEW"
    }
  });

  console.log("✅ Test product created:", product);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
