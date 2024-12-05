/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Diagnosis` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Diagnosis_title_key" ON "Diagnosis"("title");
