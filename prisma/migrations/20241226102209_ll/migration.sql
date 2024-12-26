/*
  Warnings:

  - Added the required column `state` to the `Form` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "State" AS ENUM ('new', 'inProgress', 'accepted', 'rejected');

-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "state" "State" NOT NULL;
