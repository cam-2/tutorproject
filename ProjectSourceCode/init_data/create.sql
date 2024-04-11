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
    password VARCHAR(200) NOT NULL/*,
    fk_avail_id INT REFERENCES availability(id)*/
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
    summary VARCHAR(500),
    fk_tutor_id INT REFERENCES tutors(id) NOT NULL,
    fk_student_id INT REFERENCES students(id) NOT NULL,
    fk_subject_id INT REFERENCES subject(id) NOT NULL,
    post_date TIMESTAMP
);

DROP TABLE IF EXISTS timeslot;
CREATE TABLE timeslot (
    id SERIAL PRIMARY KEY NOT NULL,
    /*fk_avail_id INT REFERENCES availability(id),*/
    fk_tutor_id INT REFERENCES tutors(id) NOT NULL,
    fk_subject_id INT REFERENCES subject(id) NOT NULL, 
    start_time TIMESTAMP,
    end_time TIMESTAMP
);

/*
DROP TABLE IF EXISTS availability;
CREATE TABLE availability (
    id SERIAL PRIMARY KEY NOT NULL,
    fk_tutor_id INT REFERENCES tutors(id) 
);
*/

DROP TABLE IF EXISTS tutor_to_student;
CREATE TABLE tutor_to_student (
    id SERIAL PRIMARY KEY NOT NULL,
    fk_tutor_id INT REFERENCES tutors(id) NOT NULL,
    fk_student_id INT REFERENCES students(id) NOT NULL
);