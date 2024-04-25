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
(6,4),
(7,8),
(7,1),
(7,9),
(8,6),
(8,7),
(9,5),
(9,4),
(10, 2),
(6,4);


INSERT INTO posts (title, content, fk_tutor_id, post_date, likes) VALUES
('Mastering Math Concepts', 'Join us as we explore key strategies to excel in mathematics.', 1, '2024-04-18 09:30:00',0),
('Physics Fundamentals', 'Dive deep into the principles of physics with simple explanations.', 2, '2024-04-19 10:30:00',6),
('Historical Insights', 'Learn about major historical events and their impact on the world.', 2, '2024-04-20 11:30:00',3),
('Writing Essentials', 'Improve your writing skills with tips from an English expert.', 3, '2024-04-21 12:00:00',87),
('Philosophical Thoughts', 'Explore philosophical theories that shaped the modern world.', 4, '2024-04-22 13:00:00',12),
('Chemical Reactions Unfolded', 'Understand the magic of chemistry through exciting experiments.', 5, '2024-04-23 14:00:00',1),
('Biology Breakthroughs', 'Delve into the latest discoveries in the field of biology.', 5, '2024-04-24 15:00:00',0),
('Calculus Challenges', 'Solve complex calculus problems with ease and confidence.', 6, '2024-04-25 16:00:00',13),
('The Probability Pit', 'Navigate the intriguing world of probability and statistics.', 7, '2024-04-26 17:00:00',2),
('Literature and Life', 'Discover how classic literature influences our lives today.', 8, '2024-04-27 18:00:00',0),
('Physics in Everyday Life', 'See how physics applies to daily phenomena and gadgets.', 9, '2024-04-28 19:00:00',0),
('Mathematical Puzzles', 'Challenge yourself with mind-bending mathematical puzzles.', 10, '2024-04-29 20:00:00',3),
('The Art of Debate', 'Learn effective debate techniques and improve your argumentation skills.', 1, '2024-04-30 21:00:00',66),
('Science Behind Cooking', 'Explore the chemistry that makes your favorite dishes delicious.', 2, '2024-05-01 09:00:00',6),
('Understanding Genetics', 'Unravel the complexities of genetics in modern biology.', 3, '2024-05-02 10:00:00',132),
('Exploring Space', 'Journey through the universe and learn about space exploration.', 4, '2024-05-03 11:00:00',0),
('The Digital Age', 'Discuss the impacts of digital technology on society and our future.', 5, '2024-05-04 12:00:00',23),
('Mind and Meditation', 'Explore the benefits of meditation on mental health and focus.', 6, '2024-05-05 13:00:00',16),
('The Future of AI', 'Dive into the advancements and ethical considerations of artificial intelligence.', 7, '2024-05-06 14:00:00',0),
('Global Warming Facts', 'Understand the science behind global warming and climate change.', 8, '2024-05-07 15:00:00',28);
