/*
  Warnings:

  - You are about to drop the column `response_value` on the `UserResponses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserResponses" DROP COLUMN "response_value",
ADD COLUMN     "responses_value" INTEGER[];
