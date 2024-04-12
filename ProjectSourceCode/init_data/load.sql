/* 
   We can put load statements in this file and then modify the docker file
   so that whenever somebody wants to test our website it already has
   pre-existing data in it.
*/
-- used these for testing the rating feature
INSERT INTO students (subject_id, username, first_name, last_name, email, password, year, major)
VALUES
(NULL, 'student1', 'First', 'Student1', 'student1@example.com', 'password1', 1, 'Major1'),
(NULL, 'student2', 'Second', 'Student2', 'student2@example.com', 'password2', 2, 'Major2'),
(NULL, 'student3', 'Third', 'Student3', 'student3@example.com', 'password3', 3, 'Major3'),
(NULL, 'student4', 'Fourth', 'Student4', 'student4@example.com', 'password4', 4, 'Major4'),
(NULL, 'student5', 'Fifth', 'Student5', 'student5@example.com', 'password5', 1, 'Major5'),
(NULL, 'student6', 'Sixth', 'Student6', 'student6@example.com', 'password6', 2, 'Major6'),
(NULL, 'student7', 'Seventh', 'Student7', 'student7@example.com', 'password7', 3, 'Major7'),
(NULL, 'student8', 'Eighth', 'Student8', 'student8@example.com', 'password8', 4, 'Major8'),
(NULL, 'student9', 'Ninth', 'Student9', 'student9@example.com', 'password9', 1, 'Major9'),
(NULL, 'student10', 'Tenth', 'Student10', 'student10@example.com', 'password10', 2, 'Major10');
INSERT INTO tutors (subject_id, username, first_name, last_name, email, password)
VALUES
(NULL, 'tutor1', 'First', 'Tutor1', 'tutor1@example.com', 'password1'),
(NULL, 'tutor2', 'Second', 'Tutor2', 'tutor2@example.com', 'password2'),
(NULL, 'tutor3', 'Third', 'Tutor3', 'tutor3@example.com', 'password3'),
(NULL, 'tutor4', 'Fourth', 'Tutor4', 'tutor4@example.com', 'password4'),
(NULL, 'tutor5', 'Fifth', 'Tutor5', 'tutor5@example.com', 'password5'),
(NULL, 'tutor6', 'Sixth', 'Tutor6', 'tutor6@example.com', 'password6'),
(NULL, 'tutor7', 'Seventh', 'Tutor7', 'tutor7@example.com', 'password7'),
(NULL, 'tutor8', 'Eighth', 'Tutor8', 'tutor8@example.com', 'password8'),
(NULL, 'tutor9', 'Ninth', 'Tutor9', 'tutor9@example.com', 'password9'),
(NULL, 'tutor10', 'Tenth', 'Tutor10', 'tutor10@example.com', 'password10');

INSERT INTO ratings (tutor_id, student_id, rating)
VALUES
(1, 1, 5),
(1, 2, 4),
(2, 3, 5),
(2, 4, 3),
(3, 5, 2),
(3, 6, 4),
(4, 7, 5),
(4, 8, 5),
(5, 9, 4),
(5, 10, 3),
(6, 1, 4),
(6, 2, 2),
(7, 3, 5),
(7, 4, 5),
(8, 5, 4),
(8, 6, 3),
(9, 7, 2),
(9, 8, 4),
(10, 9, 5),
(10, 10, 5);
