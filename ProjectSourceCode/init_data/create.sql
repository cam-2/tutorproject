DROP TABLE IF EXISTS students;
CREATE TABLE students (
    id SERIAL PRIMARY KEY NOT NULL,
    -- fk_review_id INT REFERENCES stud_to_review(id),
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
    -- fk_review_id INT REFERENCES tut_to_review(id),
    username VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(40),
    last_name VARCHAR(40),
    email VARCHAR(100),
    about VARCHAR(500),
    img_url VARCHAR(200),
    password VARCHAR(200) NOT NULL
    -- fk_avail_id INT REFERENCES availabilities(id)
);

DROP TABLE IF EXISTS subjects;
CREATE TABLE subjects (
    subject_id NUMERIC PRIMARY KEY NOT NULL,
    subject_name VARCHAR(30)
);

DROP TABLE IF EXISTS tutor_subjects;
CREATE TABLE tutor_subjects (
  subject_id INTEGER NOT NULL REFERENCES subjects (subject_id),
  tutor_id INTEGER NOT NULL REFERENCES tutors (id)
);

DROP TABLE IF EXISTS ratings; -- TABLE USED FOR RATING SYSTEM!
CREATE TABLE ratings (
    rating_id SERIAL PRIMARY KEY NOT NULL,
    tutor_id INT NOT NULL,
    student_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    FOREIGN KEY (tutor_id) REFERENCES tutors(id),
    FOREIGN KEY (student_id) REFERENCES students(id)
);

DROP TABLE IF EXISTS reviews; -- not sure if needed, not used in the rating system
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY NOT NULL,
    rating SMALLINT NOT NULL,
    summary VARCHAR(500),
    fk_tutor_id INT REFERENCES tutors(id) NOT NULL,
    fk_student_id INT REFERENCES students(id) NOT NULL,
    -- fk_subject_id INT REFERENCES subject(id) NOT NULL,
    post_date TIMESTAMP
);

DROP TABLE IF EXISTS availabilities;
CREATE TABLE availabilities (
    id SERIAL PRIMARY KEY NOT NULL,
    subject VARCHAR(20),
    description VARCHAR(500),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    tutor_name VARCHAR (50),
    fk_tutor_id INT REFERENCES tutors(id) NOT NULL, -- the tutor hosting the appointment
    fk_student_id INT REFERENCES students(id), -- the student who booked the appointment, can be NULL
    booked_bool BOOLEAN -- NULL or FALSE means it hasn't been booked yet, TRUE means the appointment has been reserved
);

DROP TABLE IF EXISTS posts;
CREATE TABLE posts (
    id SERIAL PRIMARY KEY NOT NULL,
    title VARCHAR(35),
    content VARCHAR(500),
    fk_tutor_id INT REFERENCES tutors(id) NOT NULL,
    post_date TIMESTAMP,
    likes INT
);