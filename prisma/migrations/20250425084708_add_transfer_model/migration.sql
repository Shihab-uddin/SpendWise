/*
  Warnings:

  - You are about to drop the column `day` on the `transfer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `transfer` DROP COLUMN `day`,
    ADD COLUMN `description` VARCHAR(191) NULL;
