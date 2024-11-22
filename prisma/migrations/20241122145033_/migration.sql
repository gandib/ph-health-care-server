/*
  Warnings:

  - A unique constraint covering the columns `[startDateTime]` on the table `schedules` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[endDateTime]` on the table `schedules` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "schedules_startDateTime_key" ON "schedules"("startDateTime");

-- CreateIndex
CREATE UNIQUE INDEX "schedules_endDateTime_key" ON "schedules"("endDateTime");
