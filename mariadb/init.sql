CREATE DATABASE IF NOT EXISTS mysql;

USE mysql;

CREATE TABLE `ko_en` (
    `index` INT(11) NOT NULL AUTO_INCREMENT,
    `input` VARCHAR(1000) NOT NULL COLLATE 'utf8mb4_general_ci',
    `output` VARCHAR(1000) NOT NULL COLLATE 'utf8mb4_general_ci',
    PRIMARY KEY (`index`) USING BTREE
) COLLATE='utf8mb4_general_ci' ENGINE=InnoDB AUTO_INCREMENT=66;

CREATE USER '${MARIADB_USER}'@'%' IDENTIFIED BY '${MARIADB_PASSWORD}';
GRANT ALL PRIVILEGES ON ${MARIADB_DATABASE}.* TO '${MARIADB_USER}'@'%';
FLUSH PRIVILEGES;