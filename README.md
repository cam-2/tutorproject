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
TBD

## Current Deployment
https://github.com/cam-2/tutorproject

