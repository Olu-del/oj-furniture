-- AlterTable
ALTER TABLE `user` ADD COLUMN `accountLocked` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `failedLoginAttempts` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `resetCode` VARCHAR(191) NULL,
    ADD COLUMN `resetCodeExpiry` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `Address` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `line1` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `postcode` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
