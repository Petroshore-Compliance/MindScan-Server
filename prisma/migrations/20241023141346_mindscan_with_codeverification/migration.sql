-- CreateTable
CREATE TABLE "VerificationCodes" (
    "verificationcodes_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "code" INTEGER NOT NULL,

    CONSTRAINT "VerificationCodes_pkey" PRIMARY KEY ("verificationcodes_id")
);

-- AddForeignKey
ALTER TABLE "VerificationCodes" ADD CONSTRAINT "VerificationCodes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
