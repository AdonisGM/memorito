-- CreateTable
CREATE TABLE `User` (
    `userId` VARCHAR(50) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `forgotPasswordCode` VARCHAR(255) NULL,
    `forgotPasswordCodeExp` DATETIME(3) NULL,
    `resetPasswordCode` VARCHAR(255) NULL,
    `resetPasswordCodeExp` DATETIME(3) NULL,
    `active` BOOLEAN NOT NULL DEFAULT false,
    `activeCode` VARCHAR(255) NULL,
    `activeCodeExp` DATETIME(3) NULL,
    `avatar` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RefreshToken` (
    `refreshTokenId` VARCHAR(191) NOT NULL,
    `token` VARCHAR(200) NOT NULL,
    `expires` DATETIME(3) NOT NULL,
    `userId` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `RefreshToken_token_key`(`token`),
    PRIMARY KEY (`refreshTokenId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RefreshToken` ADD CONSTRAINT `RefreshToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
