/*
  Warnings:

  - The values [rejected] on the enum `InvitationStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `responded_at` on the `CompanyInvitation` table. All the data in the column will be lost.
  - You are about to drop the column `sent_at` on the `CompanyInvitation` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InvitationStatus_new" AS ENUM ('pending', 'accepted');
ALTER TABLE "CompanyInvitation" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "CompanyInvitation" ALTER COLUMN "status" TYPE "InvitationStatus_new" USING ("status"::text::"InvitationStatus_new");
ALTER TYPE "InvitationStatus" RENAME TO "InvitationStatus_old";
ALTER TYPE "InvitationStatus_new" RENAME TO "InvitationStatus";
DROP TYPE "InvitationStatus_old";
ALTER TABLE "CompanyInvitation" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;

-- AlterTable
ALTER TABLE "CompanyInvitation" DROP COLUMN "responded_at",
DROP COLUMN "sent_at";
