# tutorproject

## Application Description
This application pairs tutors and students up based on multiple factors. Users can register a student or tutor account, which have different properties.  
Tutors register information such as:
- Comfortable subjects
- Level of expertise
- Modality
- General location
- Available times
- Cost per session  

Student users can query for tutors based on these criteria.   
Once a student finds a tutor, the application provides the tutor’s email address for coordination. Based on their communication, a time and date is selected, and the application updates to show that time as unavailable for other students.  

## Contributors
- Cameron Thomas
- Jerry Wang
- Nathan Lamp
- Cameron Kounthapanya
- Carter Bassett

## Technology Stack Utilized
- Docker
- Node.js
- PostgreSQL
- HBS
- Express
- Github

## Prerequisites to Run
- Docker
- A suitable code compiler
- Web browser w/ internet connection

## Local Run Instructions
The deployment is on localhost via Docker. In order to access Twuttor first download the project source code from the Github page of https://github.com/cam-2/tutorproject. Following that navigate to the ProjectSourceCode directory of the project and start up docker by running: docker compose up -d. Following that the user may need to wait a bit depending on their device and especially if it is their first time for NodeJs to initialize everything. Once the Docker finishes setting up everything, navigate to the url of: http://localhost:3000/. From there, the application will be able to guide the user through everything else.


## Running Tests
Register - If a user were to register as a student with a username that is already registered, an error is provided to the user, no data is added to the students table in the database, and they get redirected to the login page (PASSED). If a user were to register as a student with a unique username, they get redirected to the registering info page, and their username and password are added to the students table in the database (PASSED). If a user were to register as a tutor with a username that is already registered, an error is provided to the user, no data is added to the tutors table in the database, and they get redirected to the login page (PASSED). If a user were to register as a tutor with a unique username they get redirected to the registering info page, and their username and password are added to the tutors table in the database (PASSED).

Login - If a user were to login as a student with a username that is not registered, an error is provided to the user, and they are redirected to the register page (PASSED). If a user were to login as a student with a valid username and password combination, they are logged in and redirected to the discover page (PASSED). If a user were to login as a tutor with a username that is not registered, an error is provided to the user, and they are redirected to the register page (PASSED). If a user were to login as a tutor with a valid username and password combination, they are logged in and redirected to the discover page (PASSED). 

Add Post - If a tutor were to be logged in, they add a post with content less than or equal to 500 characters to their about page by navigating to the profile page on the navigation bar and entering the content that they want to be posted. A logged in student can view this post on the tutor’s about page (PASSED). If a tutor were to be logged in, they cannot add a post with content greater than 500 characters to their about page by navigating to the profile page on the navigation bar and entering the content that they want to be posted. A logged in student cannot view this post on the tutor’s about page (PASSED).

Rate Tutor - If a student were to be logged in, they rate a tutor on a scale of 1 through 5 by navigating to the profile page on the navigation bar and giving the rating for the tutor they want to rate. Their rating is added to the ratings table, and the average rating for the tutor is updated taking the rating that was just added into calculation. This average rating can be viewed by logged in tutors and students and the tutor’s about page and discover page (PASSED).


## Current Deployment
https://github.com/cam-2/tutorproject

