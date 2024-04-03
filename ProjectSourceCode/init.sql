DROP TABLE IF EXISTS tutor;
CREATE TABLE tutor (
    tutor_id SERIAL PRIMARY KEY,
    uname VARCHAR (25) NOT NULL UNIQUE,
    passwd VARCHAR (50) NOT NULL,
    first_name VARCHAR (50) NOT NULL,
    last_name VARCHAR (50) NOT NULL,
    taken_courses INTEGER FOREIGN KEY,
    bookings INTEGER FOREIGN KEY
);

DROP TABLE IF EXISTS student;
CREATE TABLE student (
    student_id SERIAL PRIMARY KEY,
    uname VARCHAR (25) NOT NULL UNIQUE,
    passwd VARCHAR (50) NOT NULL,
    first_name VARCHAR (50) NOT NULL,
    last_name VARCHAR (50) NOT NULL,
    classes_help_needed INTEGER SERIAL FOREIGN KEY,
    bookings INTEGER FOREIGN KEY  
);

DROP TABLE IF EXISTS tutor_to_booking;
DROP TABLE IF EXISTS student_to_booking;
DROP TABLE IF EXISTS booking;
DROP TABLE IF EXISTS tutor_to_class;
DROP TABLE IF EXISTS student_to_class;
DROP TABLE IF EXISTS class;
DROP TABLE IF EXISTS post;