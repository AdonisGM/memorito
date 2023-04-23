/*
  Warnings:

  - You are about to drop the column `parentId` on the `permission` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `permission` DROP FOREIGN KEY `Permission_parentId_fkey`;

-- AlterTable
ALTER TABLE `permission` DROP COLUMN `parentId`;
