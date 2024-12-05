/*
  Warnings:

  - You are about to drop the column `subscription_plan_id` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `diagnosis_id` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `diagnosis_id` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `user_type` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `diagnosis_id` on the `UserDiagnosisAccess` table. All the data in the column will be lost.
  - You are about to drop the `Diagnosis` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Plan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_subscription_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_diagnosis_id_fkey";

-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_diagnosis_id_fkey";

-- DropForeignKey
ALTER TABLE "UserDiagnosisAccess" DROP CONSTRAINT "UserDiagnosisAccess_diagnosis_id_fkey";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "subscription_plan_id";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "diagnosis_id";

-- AlterTable
ALTER TABLE "Result" DROP COLUMN "diagnosis_id";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "user_type";

-- AlterTable
ALTER TABLE "UserDiagnosisAccess" DROP COLUMN "diagnosis_id";

-- DropTable
DROP TABLE "Diagnosis";

-- DropTable
DROP TABLE "Plan";

-- DropEnum
DROP TYPE "UserType";
