/*
  Warnings:

  - The primary key for the `Result` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `resultado_id` on the `Result` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Result" DROP CONSTRAINT "Result_pkey",
DROP COLUMN "resultado_id",
ADD COLUMN     "result_id" SERIAL NOT NULL,
ADD CONSTRAINT "Result_pkey" PRIMARY KEY ("result_id");
