-- CreateTable
CREATE TABLE `Permission` (
    `permissionId` VARCHAR(50) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `value` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `parentId` VARCHAR(50) NOT NULL,
    `roleRoleId` VARCHAR(50) NULL,

    UNIQUE INDEX `Permission_name_key`(`name`),
    UNIQUE INDEX `Permission_value_key`(`value`),
    PRIMARY KEY (`permissionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `roleId` VARCHAR(50) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `value` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `description` VARCHAR(255) NULL,

    UNIQUE INDEX `Role_name_key`(`name`),
    UNIQUE INDEX `Role_value_key`(`value`),
    PRIMARY KEY (`roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PermissionToRole` (
    `A` VARCHAR(50) NOT NULL,
    `B` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `_PermissionToRole_AB_unique`(`A`, `B`),
    INDEX `_PermissionToRole_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Permission` ADD CONSTRAINT `Permission_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Permission`(`permissionId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PermissionToRole` ADD CONSTRAINT `_PermissionToRole_A_fkey` FOREIGN KEY (`A`) REFERENCES `Permission`(`permissionId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PermissionToRole` ADD CONSTRAINT `_PermissionToRole_B_fkey` FOREIGN KEY (`B`) REFERENCES `Role`(`roleId`) ON DELETE CASCADE ON UPDATE CASCADE;
