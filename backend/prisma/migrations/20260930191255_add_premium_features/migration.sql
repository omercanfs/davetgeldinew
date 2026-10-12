-- AlterTable
ALTER TABLE "Guest" ADD COLUMN     "email" TEXT,
ADD COLUMN     "hasChildren" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "kvkkApproved" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "mealPreference" TEXT;

-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN     "bankAccountName" TEXT,
ADD COLUMN     "bankIban" TEXT,
ADD COLUMN     "bankMessage" TEXT,
ADD COLUMN     "storyContent" TEXT,
ADD COLUMN     "storyImageUrl" TEXT,
ADD COLUMN     "storyTitle" TEXT;

-- CreateTable
CREATE TABLE "EventStop" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "timeString" TEXT,
    "locationName" TEXT NOT NULL,
    "address" TEXT,
    "mapLink" TEXT,
    "dressCode" TEXT,
    "parkingInfo" TEXT,
    "valeInfo" TEXT,
    "accomodation" TEXT,
    "invitationId" INTEGER NOT NULL,

    CONSTRAINT "EventStop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "invitationId" INTEGER NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EventStop" ADD CONSTRAINT "EventStop_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
