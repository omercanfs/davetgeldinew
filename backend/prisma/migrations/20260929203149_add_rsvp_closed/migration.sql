/*
  Warnings:

  - You are about to drop the column `isAttending` on the `Guest` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Guest` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Invitation` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Invitation` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Invitation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Invitation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstName` to the `Guest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Guest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventDate` to the `Invitation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullAddress` to the `Invitation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationName` to the `Invitation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Invitation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Invitation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Invitation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('WEDDING', 'ENGAGEMENT', 'HENNA', 'CIRCUMCISION');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PENDING', 'ATTENDING', 'DECLINED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('IYZICO', 'PAYTR', 'STRIPE');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "Guest" DROP COLUMN "isAttending",
DROP COLUMN "name",
ADD COLUMN     "attendance" "AttendanceStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "guestCount" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "message" TEXT,
ADD COLUMN     "phoneNumber" TEXT;

-- AlterTable
ALTER TABLE "Invitation" DROP COLUMN "date",
DROP COLUMN "location",
DROP COLUMN "title",
ADD COLUMN     "brideName" TEXT,
ADD COLUMN     "coverImageUrl" TEXT,
ADD COLUMN     "eventDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fullAddress" TEXT NOT NULL,
ADD COLUMN     "groomName" TEXT,
ADD COLUMN     "isPremium" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isRsvpClosed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "locationName" TEXT NOT NULL,
ADD COLUMN     "mapCoordinates" TEXT,
ADD COLUMN     "musicUrl" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "themeId" TEXT NOT NULL DEFAULT 'classic-white',
ADD COLUMN     "type" "EventType" NOT NULL DEFAULT 'WEDDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD COLUMN     "welcomeMessage" TEXT;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gallery" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "invitationId" INTEGER NOT NULL,

    CONSTRAINT "Gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "provider" "PaymentMethod" NOT NULL,
    "transactionId" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "userId" INTEGER NOT NULL,
    "invitationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionId_key" ON "Payment"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_slug_key" ON "Invitation"("slug");

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gallery" ADD CONSTRAINT "Gallery_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
