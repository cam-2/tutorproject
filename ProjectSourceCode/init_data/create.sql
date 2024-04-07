DROP TABLE IF EXISTS students;
CREATE TABLE students (
    id SERIAL PRIMARY KEY NOT NULL,
    subject_id INT,
    review_id INT,
    username VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(40),
    last_name VARCHAR(40),
    email VARCHAR(100),
    password VARCHAR(200) NOT NULL,
    year INTEGER,
    major VARCHAR(30)
);

DROP TABLE IF EXISTS tutors;
CREATE TABLE tutors (
    id SERIAL PRIMARY KEY NOT NULL,
    subject_id INT,
    review_id INT,
    username VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(40),
    last_name VARCHAR(40),
    email VARCHAR(100),
    password VARCHAR(200) NOT NULL
);

DROP TABLE IF EXISTS subject;
CREATE TABLE subject (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(30)
);

DROP TABLE IF EXISTS review;
CREATE TABLE review (
    id SERIAL PRIMARY KEY NOT NULL,
    rating SMALLINT NOT NULL,
    summary VARCHAR(500)
);