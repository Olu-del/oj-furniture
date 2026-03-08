/*
  Warnings:

  - Made the column `deliveryTotal` on table `order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subtotal` on table `order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `deliveryPrice` on table `orderitem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageUrl` on table `orderitem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `orderitem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `address` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `line2` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `order` MODIFY `deliveryTotal` DECIMAL(10, 2) NOT NULL,
    MODIFY `subtotal` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `orderitem` MODIFY `deliveryPrice` DECIMAL(10, 2) NOT NULL,
    MODIFY `imageUrl` VARCHAR(191) NOT NULL,
    MODIFY `name` VARCHAR(191) NOT NULL;
