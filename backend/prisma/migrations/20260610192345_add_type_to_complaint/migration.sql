/*
  Warnings:

  - A unique constraint covering the columns `[orderId,userId]` on the table `Survey` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Complaint` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Address` DROP FOREIGN KEY `Address_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Complaint` DROP FOREIGN KEY `Complaint_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `Complaint` DROP FOREIGN KEY `Complaint_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_userId_fkey`;

-- DropForeignKey
ALTER TABLE `OrderItem` DROP FOREIGN KEY `OrderItem_orderId_fkey`;

-- DropIndex
DROP INDEX `Complaint_orderId_fkey` ON `Complaint`;

-- DropIndex
DROP INDEX `Complaint_userId_fkey` ON `Complaint`;

-- AlterTable
ALTER TABLE `Complaint` ADD COLUMN `type` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Survey_orderId_userId_key` ON `Survey`(`orderId`, `userId`);

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Complaint` ADD CONSTRAINT `Complaint_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Complaint` ADD CONSTRAINT `Complaint_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
