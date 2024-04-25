/* 
   We can put load statements in this file and then modify the docker file
   so that whenever somebody wants to test our website it already has
   pre-existing data in it.
*/
-- used these for testing the rating feature
INSERT INTO students (username, first_name, last_name, email, password, year, major)
VALUES
('jdoe', 'John', 'Doe', 'john.doe@example.com', 'secure123!', 1, 'Computer Science'),
('asmith', 'Anna', 'Smith', 'anna.smith@example.com', 'pass456$', 2, 'Biology'),
('rjones', 'Robert', 'Jones', 'robert.jones@example.com', 'pw789#', 3, 'Economics'),
('lgreen', 'Laura', 'Green', 'laura.green@example.com', 'mypassword!', 4, 'History'),
('twhite', 'Thomas', 'White', 'thomas.white@example.com', 'password123*', 1, 'Mathematics'),
('ebrown', 'Emily', 'Brown', 'emily.brown@example.com', 'password456*', 2, 'Physics'),
('mjohnson', 'Michael', 'Johnson', 'michael.johnson@example.com', 'password789$', 3, 'Chemistry'),
('kwilson', 'Katie', 'Wilson', 'katie.wilson@example.com', 'securepassword!', 4, 'English'),
('dlee', 'Daniel', 'Lee', 'daniel.lee@example.com', 'mypw123#', 1, 'Political Science'),
('nmoore', 'Natalie', 'Moore', 'natalie.moore@example.com', 'mypw456$', 2, 'Art History'),
('cpatel', 'Chloe', 'Patel', 'chloe.patel@example.com', 'pass789$', 3, 'Environmental Science'),
('jnguyen', 'James', 'Nguyen', 'james.nguyen@example.com', 'password234$', 4, 'Psychology'),
('sgarcia', 'Sofia', 'Garcia', 'sofia.garcia@example.com', 'securepass123!', 1, 'Philosophy'),
('awalker', 'Aaron', 'Walker', 'aaron.walker@example.com', 'pass567$', 2, 'Sociology'),
('hkumar', 'Harpreet', 'Kumar', 'harpreet.kumar@example.com', 'secure789$', 3, 'Engineering'),
('klewis', 'Kim', 'Lewis', 'kim.lewis@example.com', 'password890!', 4, 'Marketing'),
('elee', 'Ethan', 'Lee', 'ethan.lee@example.com', 'mypw234#', 1, 'Architecture'),
('mrodriguez', 'Mia', 'Rodriguez', 'mia.rodriguez@example.com', 'mypw567$', 2, 'Business Management'),
('swilliams', 'Sarah', 'Williams', 'sarah.williams@example.com', 'password345*', 3, 'Art'),
('bwilson', 'Ben', 'Wilson', 'ben.wilson@example.com', 'mypassword123$', 4, 'Music');

INSERT INTO tutors (username, first_name, last_name, about, email, password)
VALUES
('jdsmith', 'John', 'Smith', 'Experienced Math tutor with a Ph.D. in Applied Mathematics from Stanford University. Passionate about helping students discover the beauty of numbers.', 'john.smith@example.com', 'passwordJS123!'),
('emjones', 'Emily', 'Jones', 'Dedicated English tutor with over 10 years of experience in teaching and a Masters degree in English Literature from the University of Oxford.', 'emily.jones@example.com', 'securePassEJ!'),
('mjwilson', 'Michael', 'Wilson', 'Physics tutor with a passion for astrophysics and a doctoral degree from MIT. Committed to making complex theories accessible to all.', 'michael.wilson@example.com', 'physicsPass98!'),
('clarkevans', 'Clara', 'Evans', 'Seasoned Chemistry tutor, with a focus on organic chemistry. Holder of a Ph.D. from Harvard and a heart for teaching.', 'clara.evans@example.com', 'chemLove100%'),
('alexisreed', 'Alexis', 'Reed', 'Biology tutor specializing in molecular biology, with a Masters from UCLA. Dedicated to advancing students understanding and excitement about life sciences.', 'alexis.reed@example.com', 'bioSecure123!'),
('tombrown', 'Tom', 'Brown', 'Business Management tutor with real-world CEO experience and an MBA from Wharton School. Aims to equip students with practical business skills.', 'tom.brown@example.com', 'businessPass456!'),
('sandramiller', 'Sandra', 'Miller', 'Creative Writing tutor with published works in poetry and fiction, holding an MFA from the Iowa Writers Workshop.', 'sandra.miller@example.com', 'writeWell789!'),
('davidlee', 'David', 'Lee', 'Computer Science tutor specializing in algorithms and machine learning, with extensive experience in Silicon Valley.', 'david.lee@example.com', 'codeMaster321#'),
('rachelkim', 'Rachel', 'Kim', 'Art History tutor with a profound knowledge of European art movements, backed by a Ph.D. from the University of London.', 'rachel.kim@example.com', 'artHist4Life!'),
('jasonchen', 'Jason', 'Chen', 'Engineering tutor focused on electrical engineering principles and practical applications, with a degree from Stanford.', 'jason.chen@example.com', 'engPass123!'),
('sarahparker', 'Sarah', 'Parker', 'Philosophy tutor with an emphasis on ethics and existentialism, eager to provoke thoughtful discussions. Ph.D. from Yale.', 'sarah.parker@example.com', 'thinkDeep!'),
('lukegarcia', 'Luke', 'Garcia', 'History tutor specializing in modern European history, with engaging storytelling skills. M.A. from Columbia University.', 'luke.garcia@example.com', 'historyBuff!'),
('emmawhite', 'Emma', 'White', 'Statistics tutor with a knack for breaking down complex data analysis concepts into understandable terms, M.Sc. from NYU.', 'emma.white@example.com', 'statsStar456!'),
('noahrodriguez', 'Noah', 'Rodriguez', 'Environmental Science tutor dedicated to climate change issues, with a Masters from UC Berkeley.', 'noah.rodriguez@example.com', 'ecoWarrior789!'),
('oliviabrown', 'Olivia', 'Brown', 'Psychology tutor with a focus on cognitive behavioral therapy, offering deep insights from clinical practice. Psy.D. from UCLA.', 'olivia.brown@example.com', 'mindMatters!'),
('ethanmartinez', 'Ethan', 'Martinez', 'Sociology tutor with a focus on social justice issues, with active involvement in community projects. M.A. from Stanford.', 'ethan.martinez@example.com', 'socialFocus123!'),
('liayang', 'Lia', 'Yang', 'Music tutor with a concentration on classical piano, graduate of the Juilliard School, eager to inspire through music.', 'lia.yang@example.com', 'pianoPassion!'),
('matthewli', 'Matthew', 'Li', 'Economics tutor with expertise in macroeconomic theories and real-world application, Ph.D. from the University of Chicago.', 'matthew.li@example.com', 'econExpert!'),
('sophiawilliams', 'Sophia', 'Williams', 'French Language tutor with native fluency and a Masters in French literature from Sorbonne University.', 'sophia.williams@example.com', 'parlezVousFrancais123!'),
('danieljohnson', 'Daniel', 'Johnson', 'Law tutor with experience as a practicing attorney and a Juris Doctor from Harvard Law School.', 'daniel.johnson@example.com', 'lawLead456!');

INSERT INTO ratings (tutor_id, student_id, rating)
VALUES
(1, 1, 5),(1, 2, 4),(1, 3, 3),(2, 4, 5),(2, 5, 3),(2, 6, 4),(3, 7, 2),(3, 8, 4),
(3, 9, 3),(4, 10, 5),(4, 1, 5),(4, 2, 4),(5, 3, 4),(5, 4, 3),(5, 5, 5),(6, 6, 4),
(6, 7, 2),(6, 8, 4),(7, 9, 5),(7, 10, 5),(7, 1, 4),(8, 2, 4),(8, 3, 3),(8, 4, 3),
(9, 5, 2),(9, 6, 4),(9, 7, 3),(10, 8, 5),(10, 9, 5),(10, 10, 4),(11, 1, 4),(11, 2, 3),
(11, 3, 5),(12, 4, 2),(12, 5, 4),(12, 6, 5),(13, 7, 5),(13, 8, 5),(13, 9, 4),(14, 10, 4),
(14, 1, 3),(14, 2, 2),(15, 3, 3),(15, 4, 5),(15, 5, 4),(16, 6, 2),(16, 7, 4),(16, 8, 5),
(17, 9, 3),(17, 10, 4),(17, 1, 4),(18, 2, 5),(18, 3, 3),(18, 4, 2),(19, 5, 5),(19, 6, 4),
(19, 7, 4),(20, 8, 3),(20, 9, 5),(20, 10, 4);


INSERT INTO subjects (subject_id, subject_name)
VALUES
(1, 'Math'),(2, 'Physics'),(3, 'History'),(4, 'English'),(5, 'Philosophy'),(6, 'Chemistry'),(7, 'Biology'),(8, 'Calculus'),(9, 'Probability');

INSERT INTO tutor_subjects (tutor_id, subject_id)
VALUES
(1, 1),(1, 2),(2, 3),(3, 4),(3, 2),(4, 8),(4, 1),(4, 9),(5, 6),(5, 7),(6, 5),(6, 4),(7, 8),(7, 1),(7, 9),(8, 6),(8, 7),
(9, 5),(9, 4),(10, 2),(10, 3),(11, 3),(11, 4),(12, 5),(12, 6),(13, 7),(13, 8),(14, 9),(14, 1),(15, 2),(15, 3),(16, 4),
(16, 5),(17, 6),(17, 7),(18, 8),(18, 9),(19, 1),(19, 2),(20, 3),(20, 4),(1, 5),(2, 6),(3, 7),(4, 8),(5, 9),(6, 1),(7, 2),
(8, 3),(9, 4),(10, 5),(11, 6),(12, 7),(13, 8),(14, 9),(15, 1),(16, 2),(17, 3),(18, 4),(19, 5),(20, 6);


INSERT INTO posts (title, content, fk_tutor_id, post_date, likes) VALUES
('Mastering Math Concepts', 'Join us as we explore key strategies to excel in mathematics.', 1, '2024-04-18 09:30:00', 0),
('The Art of Debate', 'Learn effective debate techniques and improve your argumentation skills.', 1, '2024-04-30 21:00:00', 66),
('Physics Fundamentals', 'Dive deep into the principles of physics with simple explanations.', 2, '2024-04-19 10:30:00', 6),
('Science Behind Cooking', 'Explore the chemistry that makes your favorite dishes delicious.', 2, '2024-05-01 09:00:00', 6),
('Historical Insights', 'Learn about major historical events and their impact on the world.', 3, '2024-04-20 11:30:00', 3),
('Understanding Genetics', 'Unravel the complexities of genetics in modern biology.', 3, '2024-05-02 10:00:00', 132),
('Writing Essentials', 'Improve your writing skills with tips from an English expert.', 4, '2024-04-21 12:00:00', 87),
('Exploring Space', 'Journey through the universe and learn about space exploration.', 4, '2024-05-03 11:00:00', 0),
('Chemical Reactions Unfolded', 'Understand the magic of chemistry through exciting experiments.', 5, '2024-04-23 14:00:00', 1),
('The Digital Age', 'Discuss the impacts of digital technology on society and our future.', 5, '2024-05-04 12:00:00', 23),
('Biology Breakthroughs', 'Delve into the latest discoveries in the field of biology.', 6, '2024-04-24 15:00:00', 0),
('Mind and Meditation', 'Explore the benefits of meditation on mental health and focus.', 6, '2024-05-05 13:00:00', 16),
('Calculus Challenges', 'Solve complex calculus problems with ease and confidence.', 7, '2024-04-25 16:00:00', 13),
('The Future of AI', 'Dive into the advancements and ethical considerations of artificial intelligence.', 7, '2024-05-06 14:00:00', 0),
('The Probability Pit', 'Navigate the intriguing world of probability and statistics.', 8, '2024-04-26 17:00:00', 2),
('Global Warming Facts', 'Understand the science behind global warming and climate change.', 8, '2024-05-07 15:00:00', 28),
('Literature and Life', 'Discover how classic literature influences our lives today.', 9, '2024-04-27 18:00:00', 0),
('Physics in Everyday Life', 'See how physics applies to daily phenomena and gadgets.', 9, '2024-04-28 19:00:00', 0),
('Mathematical Puzzles', 'Challenge yourself with mind-bending mathematical puzzles.', 10, '2024-04-29 20:00:00', 3),
('Programming Concepts', 'Learn the fundamentals of programming with hands-on examples.', 10, '2024-05-08 10:00:00', 15),
('Statistical Analysis', 'Understand statistical methods and their applications in real-world scenarios.', 11, '2024-05-09 09:30:00', 4),
('Advanced Geometry', 'Explore the intricate designs and theories behind advanced geometry.', 11, '2024-05-10 11:00:00', 7),
('Evolutionary Biology', 'Examine the principles of evolution and their impact on modern science.', 12, '2024-05-11 12:00:00', 19),
('Cellular Biology', 'Dive deep into the cell structure and its functions within various life forms.', 12, '2024-05-12 14:30:00', 5),
('Philosophical Debates', 'Engage in philosophical discussions on ethics, metaphysics, and more.', 13, '2024-05-13 15:00:00', 0),
('Historical Figures', 'Learn about influential figures who shaped the course of history.', 13, '2024-05-14 17:00:00', 4),
('Literary Analysis', 'Analyze classic and contemporary works of literature for deeper insights.', 14, '2024-05-15 18:00:00', 0),
('Artistic Movements', 'Explore the evolution of art through different cultural and historical movements.', 14, '2024-05-16 19:00:00', 7),
('Engineering Marvels', 'Discover the engineering feats that have transformed our world.', 15, '2024-05-17 20:00:00', 20),
('Innovative Designs', 'Explore the creative process behind innovative designs and inventions.', 15, '2024-05-18 21:00:00', 17),
('Ethical Dilemmas', 'Discuss ethical dilemmas faced in various fields and their implications.', 16, '2024-05-19 22:00:00', 33),
('Social Justice Issues', 'Examine social justice movements and their impact on society.', 16, '2024-05-20 23:00:00', 41),
('Musical Masterpieces', 'Discover the stories and significance behind iconic musical compositions.', 17, '2024-05-21 10:00:00', 1),
('Music Theory Basics', 'Learn the fundamentals of music theory and notation for better understanding.', 17, '2024-05-22 11:00:00', 22),
('Economic Theories', 'Explore key economic theories and their implications on global markets.', 18, '2024-05-23 12:00:00', 14),
('Financial Strategies', 'Learn practical financial strategies for personal and professional success.', 18, '2024-05-24 13:00:00', 20),
('French Language Essentials', 'Master the basics of French language and culture for effective communication.', 19, '2024-05-25 14:00:00', 23),
('Cultural Immersion', 'Immerse yourself in French culture and traditions through language.', 19, '2024-05-26 15:00:00', 12),
('Legal Insights', 'Gain insights into legal principles and practices for informed decision-making.', 20, '2024-05-27 16:00:00', 34),
('Constitutional Law', 'Explore the foundations of constitutional law and its impact on society.', 20, '2024-05-28 17:00:00', 10);