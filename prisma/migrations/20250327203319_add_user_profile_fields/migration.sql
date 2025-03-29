/*
  Warnings:

  - Made the column `videoCount` on table `Course` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "videoCount" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "breakDuration" INTEGER DEFAULT 5,
ADD COLUMN     "darkModeEnabled" BOOLEAN DEFAULT false,
ADD COLUMN     "notificationsEnabled" BOOLEAN DEFAULT true,
ADD COLUMN     "sessionDuration" INTEGER DEFAULT 40,
ADD COLUMN     "sessionsPerDay" INTEGER DEFAULT 4,
ADD COLUMN     "soundEffectsEnabled" BOOLEAN DEFAULT true;
