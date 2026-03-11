-- AlterTable
ALTER TABLE `Order` ADD COLUMN `deliveryTotal` DECIMAL(10, 2) NULL,
    ADD COLUMN `subtotal` DECIMAL(10, 2) NULL;

-- AlterTable
ALTER TABLE `OrderItem` ADD COLUMN `deliveryPrice` DECIMAL(10, 2) NULL,
    ADD COLUMN `imageUrl` VARCHAR(191) NULL,
    ADD COLUMN `name` VARCHAR(191) NULL;
