const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async()=>{
  const prodId = 2;
  const carts = await prisma.cartItem.findMany({ where: { productId: prodId } });
  console.log('cartItems referencing product', carts.length);
  const orders = await prisma.orderItem.findMany({ where: { productId: prodId } });
  console.log('orderItems referencing product', orders.length);
  process.exit(0);
})();