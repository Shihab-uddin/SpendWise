/*
  Warnings:

  - You are about to drop the column `day` on the `expense` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `expense` DROP COLUMN `day`,
    ADD COLUMN `description` VARCHAR(191) NULL;
