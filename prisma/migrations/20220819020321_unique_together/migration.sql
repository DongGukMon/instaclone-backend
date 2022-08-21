/*
  Warnings:

  - A unique constraint covering the columns `[photoId,userId]` on the table `Lkie` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Lkie_photoId_userId_key" ON "Lkie"("photoId", "userId");
