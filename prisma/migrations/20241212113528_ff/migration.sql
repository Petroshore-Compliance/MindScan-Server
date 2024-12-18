-- DropForeignKey
ALTER TABLE "CompanyInvitation" DROP CONSTRAINT "CompanyInvitation_user_id_fkey";

-- AlterTable
ALTER TABLE "CompanyInvitation" ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "CompanyInvitation" ADD CONSTRAINT "CompanyInvitation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
