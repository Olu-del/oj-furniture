-- AlterTable
ALTER TABLE `product` ADD COLUMN `age` INTEGER NULL,
    ADD COLUMN `dimensions` VARCHAR(191) NULL,
    ADD COLUMN `material` VARCHAR(191) NULL,
    ADD COLUMN `sustainabilityScore` INTEGER NULL;
