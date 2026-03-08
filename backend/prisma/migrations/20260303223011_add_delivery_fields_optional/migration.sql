-- AlterTable
ALTER TABLE `order` ADD COLUMN `deliveryTotal` DECIMAL(10, 2) NULL,
    ADD COLUMN `subtotal` DECIMAL(10, 2) NULL;

-- AlterTable
ALTER TABLE `orderitem` ADD COLUMN `deliveryPrice` DECIMAL(10, 2) NULL,
    ADD COLUMN `imageUrl` VARCHAR(191) NULL,
    ADD COLUMN `name` VARCHAR(191) NULL;
