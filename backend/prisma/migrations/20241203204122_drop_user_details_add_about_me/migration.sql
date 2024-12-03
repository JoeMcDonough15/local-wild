/*
  Warnings:

  - You are about to drop the column `favoriteSubject` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `numPosts` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `numYearsExperience` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "favoriteSubject",
DROP COLUMN "numPosts",
DROP COLUMN "numYearsExperience",
ADD COLUMN     "aboutMe" VARCHAR(2000);
