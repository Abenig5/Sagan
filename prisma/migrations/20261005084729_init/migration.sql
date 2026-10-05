-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('pending', 'confirmed', 'declined');

-- CreateEnum
CREATE TYPE "CategoryId" AS ENUM ('women', 'men', 'kids', 'makeup', 'brows');

-- CreateEnum
CREATE TYPE "Lang" AS ENUM ('en', 'de');

-- CreateEnum
CREATE TYPE "HeroLogo" AS ENUM ('monogram', 'dark', 'script');

-- CreateEnum
CREATE TYPE "GallerySlot" AS ENUM ('studio', 'portrait');

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "ref" TEXT NOT NULL,
    "categoryId" "CategoryId" NOT NULL,
    "serviceId" TEXT NOT NULL,
    "hairLength" INTEGER,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "notes" TEXT,
    "lang" "Lang" NOT NULL DEFAULT 'de',
    "status" "BookingStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decidedAt" TIMESTAMP(3),
    "decidedBy" TEXT,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "hours" JSONB NOT NULL,
    "slotMinutes" INTEGER NOT NULL DEFAULT 30,
    "lastBeforeCloseMinutes" INTEGER NOT NULL DEFAULT 60,
    "bookingWindowWeeks" INTEGER NOT NULL DEFAULT 8,
    "heroLogo" "HeroLogo" NOT NULL DEFAULT 'monogram',
    "mapLat" DOUBLE PRECISION,
    "mapLng" DOUBLE PRECISION,
    "mapZoom" INTEGER NOT NULL DEFAULT 16,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryImage" (
    "id" TEXT NOT NULL,
    "slot" "GallerySlot" NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "mime" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockedSlot" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,

    CONSTRAINT "BlockedSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Closure" (
    "id" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "note" TEXT,

    CONSTRAINT "Closure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StaffUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Booking_ref_key" ON "Booking"("ref");

-- CreateIndex
CREATE INDEX "Booking_date_time_idx" ON "Booking"("date", "time");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE INDEX "GalleryImage_slot_position_idx" ON "GalleryImage"("slot", "position");

-- CreateIndex
CREATE INDEX "BlockedSlot_date_idx" ON "BlockedSlot"("date");

-- CreateIndex
CREATE UNIQUE INDEX "BlockedSlot_date_time_key" ON "BlockedSlot"("date", "time");

-- CreateIndex
CREATE INDEX "Closure_from_to_idx" ON "Closure"("from", "to");

-- CreateIndex
CREATE UNIQUE INDEX "StaffUser_email_key" ON "StaffUser"("email");
