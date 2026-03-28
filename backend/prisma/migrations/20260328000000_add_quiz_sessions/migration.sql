-- Migration : ajout quiz_sessions, quiz_attempts et lesson_slug sur questions
-- À appliquer avec : npx prisma migrate dev --name add_quiz_sessions
-- OU manuellement si la BDD est déjà en production.

-- 1. Colonne lesson_slug sur questions (nullable — rétrocompatible)
ALTER TABLE `questions`
  ADD COLUMN `lesson_slug` VARCHAR(100) DEFAULT NULL AFTER `category`;

ALTER TABLE `questions`
  ADD INDEX `questions_lesson_slug_idx` (`lesson_slug`);

ALTER TABLE `questions`
  ADD INDEX `questions_level_category_idx` (`level`, `category`);

-- 2. Enum QuizSessionStatus (MySQL gère les enums inline dans la table)

-- 3. Table quiz_sessions
CREATE TABLE `quiz_sessions` (
  `id`           VARCHAR(36)  NOT NULL,
  `user_id`      INT          NOT NULL,
  `lesson_slug`  VARCHAR(100) NOT NULL,
  `status`       ENUM('IN_PROGRESS','COMPLETED','ABANDONED') NOT NULL DEFAULT 'IN_PROGRESS',
  `score`        INT          NOT NULL DEFAULT 0,
  `max_score`    INT          NOT NULL DEFAULT 0,
  `question_ids` JSON         NOT NULL,
  `xp_awarded`   TINYINT(1)   NOT NULL DEFAULT 0,
  `started_at`   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `completed_at` DATETIME(3)  DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `quiz_sessions_user_lesson_idx` (`user_id`, `lesson_slug`),
  INDEX `quiz_sessions_status_idx` (`status`),
  CONSTRAINT `quiz_sessions_user_fk`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table quiz_attempts
CREATE TABLE `quiz_attempts` (
  `id`          INT          NOT NULL AUTO_INCREMENT,
  `session_id`  VARCHAR(36)  NOT NULL,
  `question_id` INT          NOT NULL,
  `userAnswer`  TEXT         COLLATE utf8mb4_unicode_ci NOT NULL,
  `isCorrect`   TINYINT(1)   NOT NULL,
  `score`       INT          NOT NULL DEFAULT 0,
  `answered_at` DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `quiz_attempts_session_question_unique` (`session_id`, `question_id`),
  CONSTRAINT `quiz_attempts_session_fk`
    FOREIGN KEY (`session_id`)  REFERENCES `quiz_sessions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `quiz_attempts_question_fk`
    FOREIGN KEY (`question_id`) REFERENCES `questions`    (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Remplissage initial de lesson_slug sur les questions existantes
--    (à adapter selon ton mapping lesson ↔ questions)
UPDATE `questions` SET `lesson_slug` = 'verbe-to-be'
  WHERE `level` = 'A1' AND `category` = 'GRAMMAR' AND `id` BETWEEN 271 AND 280;

UPDATE `questions` SET `lesson_slug` = 'verbe-to-have'
  WHERE `level` = 'A1' AND `category` = 'GRAMMAR' AND `id` IN (280);

UPDATE `questions` SET `lesson_slug` = 'present-continu'
  WHERE `level` = 'A2' AND `category` = 'GRAMMAR' AND `id` BETWEEN 291 AND 307;

UPDATE `questions` SET `lesson_slug` = 'vocabulaire-famille'
  WHERE `level` = 'A1' AND `category` = 'VOCABULARY' AND `id` BETWEEN 283 AND 290;
