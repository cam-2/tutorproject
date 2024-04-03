DROP TABLE IF EXISTS students;
CREATE TABLE students (
    username VARCHAR(50) PRIMARY KEY,
    password CHAR(60) NOT NULL
);

DROP TABLE IF EXISTS tutors;
CREATE TABLE tutors (
    username VARCHAR(50) PRIMARY KEY,
    password CHAR(60) NOT NULL
);