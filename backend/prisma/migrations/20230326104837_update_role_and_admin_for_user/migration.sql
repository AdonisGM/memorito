/*
  Warnings:

  - Added the required column `roleId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_userId_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `roleId` VARCHAR(50) NOT NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`roleId`) ON DELETE RESTRICT ON UPDATE CASCADE;
