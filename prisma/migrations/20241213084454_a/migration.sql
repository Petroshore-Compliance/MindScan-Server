/*
  Warnings:

  - You are about to drop the column `status` on the `CompanyInvitation` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Question` table. All the data in the column will be lost.
  - The primary key for the `Result` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `completed_at` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `result_id` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the `Response` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `form` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `petroAdmin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `questionAnswer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `resultado` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userResponses` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[invitation_token]` on the table `CompanyInvitation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `content_en` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content_es` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content_pt` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actions` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `activity` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `aesthetic_appreciation` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `agreeableness_or_amiability` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `altruism` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `anxiety` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assertiveness` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `competence` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `conciliatory_attitude` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cordiality` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliberation` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `depression` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `excitement_seeking` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `extraversion` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fantasy` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `feelings` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `frankness` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gregariousness` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hostility` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ideas` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `impulsivity` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modesty` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `need_for_achievement` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neuroticism_x_emotional_stability` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openness_to_experience` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderliness` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `perseverance_or_responsibility` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `positive_emotions` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `self_discipline` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sense_of_duty` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sensitivity_to_others` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `social_anxiety` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trust` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `values` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vulnerability` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_question_id_fkey";

-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_user_id_fkey";

-- DropForeignKey
ALTER TABLE "resultado" DROP CONSTRAINT "resultado_user_id_fkey";

-- DropForeignKey
ALTER TABLE "userResponses" DROP CONSTRAINT "userResponses_questionAnswer_id_fkey";

-- DropForeignKey
ALTER TABLE "userResponses" DROP CONSTRAINT "userResponses_question_id_fkey";

-- DropForeignKey
ALTER TABLE "userResponses" DROP CONSTRAINT "userResponses_user_id_fkey";

-- AlterTable
ALTER TABLE "CompanyInvitation" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "content",
ADD COLUMN     "content_en" TEXT NOT NULL,
ADD COLUMN     "content_es" TEXT NOT NULL,
ADD COLUMN     "content_pt" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Result" DROP CONSTRAINT "Result_pkey",
DROP COLUMN "completed_at",
DROP COLUMN "created_at",
DROP COLUMN "result_id",
DROP COLUMN "updated_at",
ADD COLUMN     "actions" INTEGER NOT NULL,
ADD COLUMN     "activity" INTEGER NOT NULL,
ADD COLUMN     "aesthetic_appreciation" INTEGER NOT NULL,
ADD COLUMN     "agreeableness_or_amiability" INTEGER NOT NULL,
ADD COLUMN     "altruism" INTEGER NOT NULL,
ADD COLUMN     "anxiety" INTEGER NOT NULL,
ADD COLUMN     "assertiveness" INTEGER NOT NULL,
ADD COLUMN     "competence" INTEGER NOT NULL,
ADD COLUMN     "conciliatory_attitude" INTEGER NOT NULL,
ADD COLUMN     "cordiality" INTEGER NOT NULL,
ADD COLUMN     "deliberation" INTEGER NOT NULL,
ADD COLUMN     "depression" INTEGER NOT NULL,
ADD COLUMN     "excitement_seeking" INTEGER NOT NULL,
ADD COLUMN     "extraversion" INTEGER NOT NULL,
ADD COLUMN     "fantasy" INTEGER NOT NULL,
ADD COLUMN     "feelings" INTEGER NOT NULL,
ADD COLUMN     "frankness" INTEGER NOT NULL,
ADD COLUMN     "gregariousness" INTEGER NOT NULL,
ADD COLUMN     "hostility" INTEGER NOT NULL,
ADD COLUMN     "ideas" INTEGER NOT NULL,
ADD COLUMN     "impulsivity" INTEGER NOT NULL,
ADD COLUMN     "modesty" INTEGER NOT NULL,
ADD COLUMN     "need_for_achievement" INTEGER NOT NULL,
ADD COLUMN     "neuroticism_x_emotional_stability" INTEGER NOT NULL,
ADD COLUMN     "openness_to_experience" INTEGER NOT NULL,
ADD COLUMN     "orderliness" INTEGER NOT NULL,
ADD COLUMN     "perseverance_or_responsibility" INTEGER NOT NULL,
ADD COLUMN     "positive_emotions" INTEGER NOT NULL,
ADD COLUMN     "resultado_id" SERIAL NOT NULL,
ADD COLUMN     "self_discipline" INTEGER NOT NULL,
ADD COLUMN     "sense_of_duty" INTEGER NOT NULL,
ADD COLUMN     "sensitivity_to_others" INTEGER NOT NULL,
ADD COLUMN     "social_anxiety" INTEGER NOT NULL,
ADD COLUMN     "trust" INTEGER NOT NULL,
ADD COLUMN     "values" INTEGER NOT NULL,
ADD COLUMN     "vulnerability" INTEGER NOT NULL,
ADD CONSTRAINT "Result_pkey" PRIMARY KEY ("resultado_id");

-- DropTable
DROP TABLE "Response";

-- DropTable
DROP TABLE "form";

-- DropTable
DROP TABLE "petroAdmin";

-- DropTable
DROP TABLE "question";

-- DropTable
DROP TABLE "questionAnswer";

-- DropTable
DROP TABLE "resultado";

-- DropTable
DROP TABLE "userResponses";

-- DropEnum
DROP TYPE "InvitationStatus";

-- CreateTable
CREATE TABLE "QuestionAnswer" (
    "questionAnswer_id" SERIAL NOT NULL,
    "answer_pt" TEXT NOT NULL,
    "anser_es" TEXT NOT NULL,
    "answer_en" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "QuestionAnswer_pkey" PRIMARY KEY ("questionAnswer_id")
);

-- CreateTable
CREATE TABLE "UserResponses" (
    "userResponses_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "questionAnswer_id" INTEGER NOT NULL,

    CONSTRAINT "UserResponses_pkey" PRIMARY KEY ("userResponses_id")
);

-- CreateTable
CREATE TABLE "Form" (
    "form_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("form_id")
);

-- CreateTable
CREATE TABLE "PetroAdmin" (
    "petroAdmin_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "notifications" BOOLEAN NOT NULL,

    CONSTRAINT "PetroAdmin_pkey" PRIMARY KEY ("petroAdmin_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyInvitation_invitation_token_key" ON "CompanyInvitation"("invitation_token");

-- AddForeignKey
ALTER TABLE "UserResponses" ADD CONSTRAINT "UserResponses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserResponses" ADD CONSTRAINT "UserResponses_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("question_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserResponses" ADD CONSTRAINT "UserResponses_questionAnswer_id_fkey" FOREIGN KEY ("questionAnswer_id") REFERENCES "QuestionAnswer"("questionAnswer_id") ON DELETE RESTRICT ON UPDATE CASCADE;
