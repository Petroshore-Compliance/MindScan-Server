/*
  Warnings:

  - You are about to drop the column `anser_es` on the `QuestionAnswer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[answer_es]` on the table `QuestionAnswer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `answer_es` to the `QuestionAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "QuestionAnswer_anser_es_key";

-- AlterTable
ALTER TABLE "QuestionAnswer" DROP COLUMN "anser_es",
ADD COLUMN     "answer_es" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "QuestionAnswer_answer_es_key" ON "QuestionAnswer"("answer_es");
