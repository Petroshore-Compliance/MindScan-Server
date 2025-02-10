-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'manager', 'employee');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pending', 'cancelled', 'rejected', 'accepted', 'expired');

-- CreateEnum
CREATE TYPE "State" AS ENUM ('new', 'inProgress', 'accepted', 'rejected', 'contacted');

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "role" "Role",
    "company_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "connected_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Company" (
    "company_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "licenses" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("company_id")
);

-- CreateTable
CREATE TABLE "UserDiagnosisAccess" (
    "access_id" SERIAL NOT NULL,
    "has_access" BOOLEAN NOT NULL,
    "granted_by" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "UserDiagnosisAccess_pkey" PRIMARY KEY ("access_id")
);

-- CreateTable
CREATE TABLE "CompanyInvitation" (
    "invitation_id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "user_id" INTEGER,
    "invitation_token" TEXT NOT NULL,
    "company_id" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "CompanyInvitation_pkey" PRIMARY KEY ("invitation_id")
);

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
CREATE TABLE "Question" (
    "question_id" SERIAL NOT NULL,
    "content_es" TEXT NOT NULL,
    "content_en" TEXT NOT NULL,
    "content_pt" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Question_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "UserResponses" (
    "userResponses_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "questionAnswer_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "UserResponses_pkey" PRIMARY KEY ("userResponses_id")
);

-- CreateTable
CREATE TABLE "ContactForm" (
    "form_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "state" "State" NOT NULL DEFAULT 'new',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "ContactForm_pkey" PRIMARY KEY ("form_id")
);

-- CreateTable
CREATE TABLE "PetroAdmin" (
    "petroAdmin_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "notifications" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "connected_at" TIMESTAMP(3),

    CONSTRAINT "PetroAdmin_pkey" PRIMARY KEY ("petroAdmin_id")
);

-- CreateTable
CREATE TABLE "Result" (
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
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Result_pkey" PRIMARY KEY ("resultado_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Company_email_key" ON "Company"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyInvitation_invitation_token_key" ON "CompanyInvitation"("invitation_token");

-- CreateIndex
CREATE UNIQUE INDEX "PetroAdmin_email_key" ON "PetroAdmin"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("company_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDiagnosisAccess" ADD CONSTRAINT "UserDiagnosisAccess_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyInvitation" ADD CONSTRAINT "CompanyInvitation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyInvitation" ADD CONSTRAINT "CompanyInvitation_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserResponses" ADD CONSTRAINT "UserResponses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserResponses" ADD CONSTRAINT "UserResponses_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("question_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserResponses" ADD CONSTRAINT "UserResponses_questionAnswer_id_fkey" FOREIGN KEY ("questionAnswer_id") REFERENCES "QuestionAnswer"("questionAnswer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
