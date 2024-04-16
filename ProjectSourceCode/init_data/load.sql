/* 
   We can put load statements in this file and then modify the docker file
   so that whenever somebody wants to test our website it already has
   pre-existing data in it.
*/
-- used these for testing the rating feature
INSERT INTO students (username, first_name, last_name, email, password, year, major)
VALUES
('student1', 'First', 'Student1', 'student1@example.com', 'password1', 1, 'Major1'),
('student2', 'Second', 'Student2', 'student2@example.com', 'password2', 2, 'Major2'),
('student3', 'Third', 'Student3', 'student3@example.com', 'password3', 3, 'Major3'),
('student4', 'Fourth', 'Student4', 'student4@example.com', 'password4', 4, 'Major4'),
('student5', 'Fifth', 'Student5', 'student5@example.com', 'password5', 1, 'Major5'),
('student6', 'Sixth', 'Student6', 'student6@example.com', 'password6', 2, 'Major6'),
('student7', 'Seventh', 'Student7', 'student7@example.com', 'password7', 3, 'Major7'),
('student8', 'Eighth', 'Student8', 'student8@example.com', 'password8', 4, 'Major8'),
('student9', 'Ninth', 'Student9', 'student9@example.com', 'password9', 1, 'Major9'),
('student10', 'Tenth', 'Student10', 'student10@example.com', 'password10', 2, 'Major10');
INSERT INTO tutors (username, first_name, last_name, about, email, password)
VALUES
('tutor1', 'First', 'Tutor1', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. 
Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis 
dis parturient montes, nascetur ridiculus mus. Donec ultricies nec, pellentesque 
eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, 
aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, 
justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibu','tutor1@example.com', 
'password1'),
('tutor2', 'Second', 'Tutor2','asdsdsdasdas', 'tutor2@example.com', 'password2'),
('tutor3', 'Third', 'Tutor3','asadasgsdagdbcx', 'tutor3@example.com', 'password3'),
('tutor4', 'Fourth', 'Tutor4','aslkdfhsalkjdhflsksljfgs;lkf;s', 'tutor4@example.com', 'password4'),
('tutor5', 'Fifth', 'Tutor5','jkdhglkjdnm,cxnlkbjhljkwebnm,sdbngliheiulg', 'tutor5@example.com', 'password5'),
('tutor6', 'Sixth', 'Tutor6','3ouhjscnxvp9p1y34jknlfnvxz98j', 'tutor6@example.com', 'password6'),
('tutor7', 'Seventh', 'Tutor7','1289ulknvxzlkjvh9831hnrjkl1bo8b', 'tutor7@example.com', 'password7'),
('tutor8', 'Eighth', 'Tutor8','1o23hjfdsnlfjknasdlkjnl', 'tutor8@example.com', 'password8'),
('tutor9', 'Ninth', 'Tutor9','skjfhnasdlibvm,x lkjdsbflkjsbdlk', 'tutor9@example.com', 'password9'),
('tutor10', 'Tenth', 'Tutor10','wejhfkjlsdnflisadbcklaslkj', 'tutor10@example.com', 'password10');

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

INSERT INTO subjects (subject_id, subject_name)
VALUES
(1, 'Math'),
(2, 'Physics'),
(3, 'History'),
(4, 'English'),
(5, 'Philosophy'),
(6, 'Chemistry'),
(7, 'Biology'),
(8, 'Calculus'),
(9, 'Probability');

INSERT INTO tutor_subjects
  (tutor_id, subject_id)
VALUES
(1,1),
(1,2),
(2,3),
(3,4),
(3,2),
(4,8),
(4,1),
(4,9),
(5,6),
(5,7),
(6,5),
(6,4);
