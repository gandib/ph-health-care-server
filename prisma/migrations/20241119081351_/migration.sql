/*
  Warnings:

  - You are about to drop the `doctor-specialties` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "doctor-specialties" DROP CONSTRAINT "doctor-specialties_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "doctor-specialties" DROP CONSTRAINT "doctor-specialties_specialtiesId_fkey";

-- DropTable
DROP TABLE "doctor-specialties";

-- CreateTable
CREATE TABLE "doctor-specialities" (
    "specialitiesId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,

    CONSTRAINT "doctor-specialities_pkey" PRIMARY KEY ("specialitiesId","doctorId")
);

-- AddForeignKey
ALTER TABLE "doctor-specialities" ADD CONSTRAINT "doctor-specialities_specialitiesId_fkey" FOREIGN KEY ("specialitiesId") REFERENCES "specialities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor-specialities" ADD CONSTRAINT "doctor-specialities_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
