-- CreateTable
CREATE TABLE `Booking` (
    `id` VARCHAR(191) NOT NULL,
    `ref` VARCHAR(191) NOT NULL,
    `categoryId` ENUM('women', 'men', 'kids', 'makeup', 'brows') NOT NULL,
    `serviceId` VARCHAR(191) NOT NULL,
    `hairLength` INTEGER NULL,
    `date` VARCHAR(191) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `notes` TEXT NULL,
    `lang` ENUM('en', 'de') NOT NULL DEFAULT 'de',
    `status` ENUM('pending', 'confirmed', 'declined') NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `decidedAt` DATETIME(3) NULL,
    `decidedBy` VARCHAR(191) NULL,

    UNIQUE INDEX `Booking_ref_key`(`ref`),
    INDEX `Booking_date_time_idx`(`date`, `time`),
    INDEX `Booking_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Settings` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `hours` JSON NOT NULL,
    `slotMinutes` INTEGER NOT NULL DEFAULT 30,
    `lastBeforeCloseMinutes` INTEGER NOT NULL DEFAULT 60,
    `bookingWindowWeeks` INTEGER NOT NULL DEFAULT 8,
    `heroLogo` ENUM('monogram', 'dark', 'script') NOT NULL DEFAULT 'monogram',
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BlockedSlot` (
    `id` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `time` VARCHAR(191) NOT NULL,

    INDEX `BlockedSlot_date_idx`(`date`),
    UNIQUE INDEX `BlockedSlot_date_time_key`(`date`, `time`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Closure` (
    `id` VARCHAR(191) NOT NULL,
    `from` VARCHAR(191) NOT NULL,
    `to` VARCHAR(191) NOT NULL,
    `note` VARCHAR(191) NULL,

    INDEX `Closure_from_to_idx`(`from`, `to`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StaffUser` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `StaffUser_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
