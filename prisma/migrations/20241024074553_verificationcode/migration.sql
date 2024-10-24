/*
  Warnings:

  - You are about to drop the `VerificationCodes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "VerificationCodes" DROP CONSTRAINT "VerificationCodes_user_id_fkey";

-- DropTable
DROP TABLE "VerificationCodes";

-- CreateTable
CREATE TABLE "VerificationCode" (
    "verificationcodes_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "code" INTEGER NOT NULL,

    CONSTRAINT "VerificationCode_pkey" PRIMARY KEY ("verificationcodes_id")
);

-- AddForeignKey
ALTER TABLE "VerificationCode" ADD CONSTRAINT "VerificationCode_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
