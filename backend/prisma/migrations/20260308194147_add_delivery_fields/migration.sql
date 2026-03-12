-- AlterTable
ALTER TABLE `Order` ADD COLUMN `deliveryDate` DATETIME(3) NULL,
    ADD COLUMN `deliverySlot` VARCHAR(191) NULL,
    ADD COLUMN `deliveryStatus` VARCHAR(191) NULL;
