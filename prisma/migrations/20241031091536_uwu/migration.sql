/*
  Warnings:

  - You are about to drop the column `connected_at` on the `Question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "connected_at";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "connected_at" TIMESTAMP(3);
