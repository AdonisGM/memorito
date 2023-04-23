-- DropForeignKey
ALTER TABLE `permission` DROP FOREIGN KEY `Permission_parentId_fkey`;

-- AlterTable
ALTER TABLE `permission` MODIFY `parentId` VARCHAR(50) NULL;

-- AddForeignKey
ALTER TABLE `Permission` ADD CONSTRAINT `Permission_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Permission`(`permissionId`) ON DELETE SET NULL ON UPDATE CASCADE;
