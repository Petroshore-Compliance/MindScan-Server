-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pending', 'cancelled', 'rejected', 'accepted', 'expired');

-- AlterTable
ALTER TABLE "CompanyInvitation" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'pending';
