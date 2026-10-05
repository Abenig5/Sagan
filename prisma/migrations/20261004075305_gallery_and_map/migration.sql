-- AlterTable
ALTER TABLE `Settings` ADD COLUMN `mapLat` DOUBLE NULL,
    ADD COLUMN `mapLng` DOUBLE NULL,
    ADD COLUMN `mapZoom` INTEGER NOT NULL DEFAULT 16;

-- CreateTable
CREATE TABLE `GalleryImage` (
    `id` VARCHAR(191) NOT NULL,
    `slot` ENUM('studio', 'portrait') NOT NULL,
    `position` INTEGER NOT NULL DEFAULT 0,
    `mime` VARCHAR(191) NOT NULL,
    `width` INTEGER NOT NULL,
    `height` INTEGER NOT NULL,
    `data` LONGBLOB NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `GalleryImage_slot_position_idx`(`slot`, `position`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
