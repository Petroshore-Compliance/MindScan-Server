/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `VerificationCode` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `VerificationCode` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "VerificationCode_user_id_key" ON "VerificationCode"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationCode_code_key" ON "VerificationCode"("code");
