/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `UserResponses` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserResponses_user_id_key" ON "UserResponses"("user_id");
