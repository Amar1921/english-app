-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `level` VARCHAR(191) NOT NULL DEFAULT 'A1',
    `xp` INTEGER NOT NULL DEFAULT 0,
    `streak` INTEGER NOT NULL DEFAULT 0,
    `lastLogin` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `verifyCode` VARCHAR(6) NULL,
    `verifyCodeExpires` DATETIME(3) NULL,
    `resetToken` VARCHAR(64) NULL,
    `resetTokenExpires` DATETIME(3) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `questions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('QCM', 'OPEN') NOT NULL,
    `level` ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2') NOT NULL,
    `category` ENUM('GRAMMAR', 'VOCABULARY', 'READING', 'LISTENING') NOT NULL,
    `question` TEXT NOT NULL,
    `choices` JSON NULL,
    `correctAnswer` TEXT NOT NULL,
    `explanation` TEXT NULL,
    `points` INTEGER NOT NULL DEFAULT 10,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attempts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `questionId` INTEGER NOT NULL,
    `userAnswer` TEXT NOT NULL,
    `isCorrect` BOOLEAN NOT NULL,
    `score` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lessons` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(100) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `title_fr` VARCHAR(200) NOT NULL,
    `description` TEXT NOT NULL,
    `description_fr` TEXT NOT NULL,
    `level` ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2') NOT NULL,
    `subject` ENUM('GRAMMAR', 'CONJUGATION', 'SPELLING', 'VOCABULARY', 'PRONUNCIATION', 'IDIOMS', 'WRITING', 'LISTENING') NOT NULL,
    `category` VARCHAR(50) NULL DEFAULT 'general',
    `order_lesson` INTEGER NOT NULL DEFAULT 0,
    `duration` INTEGER NULL DEFAULT 15,
    `difficulty` TINYINT NULL DEFAULT 1,
    `points` INTEGER NULL DEFAULT 50,
    `content` JSON NOT NULL,
    `exercises` JSON NULL,
    `resources` JSON NULL,
    `keywords` JSON NULL,
    `prerequisites` JSON NULL,
    `learning_objectives` JSON NULL,
    `common_mistakes` JSON NULL,
    `quiz_id` INTEGER NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NULL,

    UNIQUE INDEX `lessons_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `attempts` ADD CONSTRAINT `attempts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attempts` ADD CONSTRAINT `attempts_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `questions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
