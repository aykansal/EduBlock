-- CreateTable
CREATE TABLE "ScheduledLecture" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "courseId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 60,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduledLecture_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScheduledLecture_userId_videoId_date_key" ON "ScheduledLecture"("userId", "videoId", "date");

-- AddForeignKey
ALTER TABLE "ScheduledLecture" ADD CONSTRAINT "ScheduledLecture_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("walletId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledLecture" ADD CONSTRAINT "ScheduledLecture_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("videoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledLecture" ADD CONSTRAINT "ScheduledLecture_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
