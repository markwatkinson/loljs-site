CREATE TABLE IF NOT EXISTS lolcode_programs (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255),
    PRIMARY KEY(id)
) ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS lolcode_program_revisions (
    id INT AUTO_INCREMENT,
    program_id INT NOT NULL,
    revision INT NOT NULL,
    program MEDIUMTEXT,
    PRIMARY KEY(id),
    FOREIGN KEY(program_id) REFERENCES lolcode_programs(id)
) ENGINE=INNODB;