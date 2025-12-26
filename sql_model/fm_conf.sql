-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema fm_conf
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema fm_conf
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `fm_conf` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `fm_conf` ;

-- -----------------------------------------------------
-- Table `fm_conf`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fm_conf`.`users` (
  `id` VARCHAR(50) NOT NULL,
  `email` VARCHAR(50) NULL DEFAULT NULL,
  `password` VARCHAR(255) NULL DEFAULT NULL,
  `surname` VARCHAR(50) NULL DEFAULT NULL,
  `name` VARCHAR(50) NULL DEFAULT NULL,
  `fathername` VARCHAR(50) NULL DEFAULT NULL,
  `academic_degree` VARCHAR(50) NULL DEFAULT NULL,
  `academic_title` VARCHAR(50) NULL DEFAULT NULL,
  `work_address` VARCHAR(1000) NULL DEFAULT NULL,
  `job_title` VARCHAR(255) NULL DEFAULT NULL,
  `role` VARCHAR(10) NOT NULL DEFAULT 'user',
  `reset_code` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` USING BTREE (`id`) INVISIBLE,
  UNIQUE INDEX `email_UNIQUE` USING BTREE (`email`) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fm_conf`.`requests`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fm_conf`.`requests` (
  `id` VARCHAR(50) NOT NULL,
  `housing_need` TINYINT NOT NULL DEFAULT '0',
  `userID` VARCHAR(50) NULL DEFAULT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` USING BTREE (`id`) VISIBLE,
  INDEX `userID_INDEX` USING BTREE (`userID`) VISIBLE,
  CONSTRAINT `requests_users_fk`
    FOREIGN KEY (`userID`)
    REFERENCES `fm_conf`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fm_conf`.`reports`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fm_conf`.`reports` (
  `id` VARCHAR(50) NOT NULL,
  `report_title` VARCHAR(255) NULL DEFAULT NULL,
  `report_authors` VARCHAR(1000) NULL,
  `report_form` VARCHAR(255) NULL DEFAULT NULL,
  `report_filename` VARCHAR(255) NULL DEFAULT NULL,
  `scientific_direction` VARCHAR(255) NULL DEFAULT NULL,
  `requestID` VARCHAR(50) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` USING BTREE (`id`) VISIBLE,
  INDEX `requestID_INDEX` (`requestID` ASC) VISIBLE,
  CONSTRAINT `reports_requests_fk`
    FOREIGN KEY (`requestID`)
    REFERENCES `fm_conf`.`requests` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `fm_conf`.`tokens`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fm_conf`.`tokens` (
  `userID` VARCHAR(50) NOT NULL,
  `refreshToken` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE INDEX `userID_UNIQUE` USING BTREE (`userID`) VISIBLE,
  CONSTRAINT `tokens_users_fk`
    FOREIGN KEY (`userID`)
    REFERENCES `fm_conf`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE USER 'conf_user' IDENTIFIED BY 'conf!user';

GRANT ALL ON `fm_conf`.* TO 'conf_user';

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
