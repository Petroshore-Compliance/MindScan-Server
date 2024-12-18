/*
  Warnings:

  - You are about to drop the column `active` on the `CompanyInvitation` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `CompanyInvitation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "licenses" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "CompanyInvitation" DROP COLUMN "active",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "questionAnswer" (
    "questionAnswer_id" SERIAL NOT NULL,
    "answer_pt" TEXT NOT NULL,
    "anser_es" TEXT NOT NULL,
    "answer_en" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "questionAnswer_pkey" PRIMARY KEY ("questionAnswer_id")
);

-- CreateTable
CREATE TABLE "question" (
    "question_id" SERIAL NOT NULL,
    "content_es" TEXT NOT NULL,
    "content_en" TEXT NOT NULL,
    "content_pt" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "question_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "userResponses" (
    "userResponses_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "questionAnswer_id" INTEGER NOT NULL,

    CONSTRAINT "userResponses_pkey" PRIMARY KEY ("userResponses_id")
);

-- CreateTable
CREATE TABLE "form" (
    "form_id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "form_pkey" PRIMARY KEY ("form_id")
);

-- CreateTable
CREATE TABLE "petroAdmin" (
    "petroAdmin_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "notifications" BOOLEAN NOT NULL,

    CONSTRAINT "petroAdmin_pkey" PRIMARY KEY ("petroAdmin_id")
);

-- CreateTable
CREATE TABLE "resultado" (
    "resultado_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "anxiety" INTEGER NOT NULL,
    "hostility" INTEGER NOT NULL,
    "depression" INTEGER NOT NULL,
    "social_anxiety" INTEGER NOT NULL,
    "impulsivity" INTEGER NOT NULL,
    "vulnerability" INTEGER NOT NULL,
    "cordiality" INTEGER NOT NULL,
    "gregariousness" INTEGER NOT NULL,
    "assertiveness" INTEGER NOT NULL,
    "activity" INTEGER NOT NULL,
    "excitement_seeking" INTEGER NOT NULL,
    "positive_emotions" INTEGER NOT NULL,
    "fantasy" INTEGER NOT NULL,
    "aesthetic_appreciation" INTEGER NOT NULL,
    "feelings" INTEGER NOT NULL,
    "actions" INTEGER NOT NULL,
    "ideas" INTEGER NOT NULL,
    "values" INTEGER NOT NULL,
    "trust" INTEGER NOT NULL,
    "frankness" INTEGER NOT NULL,
    "altruism" INTEGER NOT NULL,
    "conciliatory_attitude" INTEGER NOT NULL,
    "modesty" INTEGER NOT NULL,
    "sensitivity_to_others" INTEGER NOT NULL,
    "competence" INTEGER NOT NULL,
    "orderliness" INTEGER NOT NULL,
    "sense_of_duty" INTEGER NOT NULL,
    "need_for_achievement" INTEGER NOT NULL,
    "self_discipline" INTEGER NOT NULL,
    "deliberation" INTEGER NOT NULL,
    "neuroticism_x_emotional_stability" INTEGER NOT NULL,
    "extraversion" INTEGER NOT NULL,
    "openness_to_experience" INTEGER NOT NULL,
    "agreeableness_or_amiability" INTEGER NOT NULL,
    "perseverance_or_responsibility" INTEGER NOT NULL,

    CONSTRAINT "resultado_pkey" PRIMARY KEY ("resultado_id")
);

-- AddForeignKey
ALTER TABLE "CompanyInvitation" ADD CONSTRAINT "CompanyInvitation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userResponses" ADD CONSTRAINT "userResponses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userResponses" ADD CONSTRAINT "userResponses_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("question_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userResponses" ADD CONSTRAINT "userResponses_questionAnswer_id_fkey" FOREIGN KEY ("questionAnswer_id") REFERENCES "questionAnswer"("questionAnswer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resultado" ADD CONSTRAINT "resultado_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
