const express = require('express'); // To build an application server or API
const app = express();
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const path = require('path');
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords
const { name } = require('body-parser');
const json = require('body-parser/lib/types/json');
const { error } = require('console');
const { Router } = require('express');
const multer  = require('multer');
const sharp = require('sharp');

let userStudent = false; // used for checking if user is a student or tutor
let userTutor = false;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img');
  },
  filename : (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.session.user.id}-${Date.now()}.${ext}`);
  }
});

const multerFilter = (req, file, cb) => {
  if(file.mimetype.startsWith('image')) {
    cb(null, true);
  }
  else {
    cb(new Error("Please upload an image.", 400), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('uploaded_file');

exports.resizeUserPhoto = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.session.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .toFile(`public/img/${req.file.filename}`);

  next();
};

const hbs = handlebars.create({
  extname: 'hbs',
  layoutsDir: __dirname + '/views/layouts', //not used rn
  partialsDir: __dirname + '/views/partials', //not used rn
});

const broaddbConfig = {
  host: process.env.host, // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(broaddbConfig);
// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

app.use(express.static(__dirname));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
 
app.use(express.static(__dirname + '/public'));

const checkSessionMiddleware = (req, res, next) => { //used to check for session in order to display logout button
  const sessionExists = req.session && req.session.user;
  res.locals.session = sessionExists;
  next();
};

app.use(checkSessionMiddleware); //applys the session check.

app.get('/welcome', (req, res) => {
  res.json({ status: 'success', message: 'Welcome!' });
});

app.get('/', (req, res) => {
  // console.log("Calling here!");
  res.redirect('/landing');
});

app.get('/login', (req, res) => {
  const message = req.query.message || ''; // Extract the message from query params
  const error = req.query.error === 'true'; // Check if error flag is true
  res.render('./pages/login.hbs', { message, error });
});

app.get('/landing', (req, res) => {
  res.render('./pages/landingPage.hbs');
});



// // function used for getting the average rating of a tutor --deprecated
// async function getTutorAverageRating(tutorId) {
//   try {
//     // get avg rating from ratings table for the tutor  
//     const result = await db.oneOrNone('SELECT AVG(rating) as average_rating FROM ratings WHERE tutor_id = $1', [tutorId]);
//     // check if the result and avg are not empty
//     if (result && result.average_rating) return parseFloat(result.average_rating).toFixed(2); // ensures 2 decimal places
//     else return 'No ratings yet';
//   } catch (error) {
//     // err handling
//     console.log('Error getting rating:', error);
//     throw error;
//   }
// }
// // new route that shows the tutor rating on a seperate page because i couldnt get it to work on the discover page, gonna try to get it to work on the discover page soon
//  --deprecated
// app.get('/tutorProfile/:tutorId', async (req, res) => {
//   const tutorId = req.params.tutorId;
//   try {
//     // get tutor with a id from the params
//     const tutorDetails = await db.one('SELECT * FROM tutors WHERE id = $1', [tutorId]);
//     // calc avg rating for a tutor
//     const averageRating = await getTutorAverageRating(tutorId);
//     // render page with given tutor and rating
//     res.render('./pages/tutorProfile.hbs', { tutor: tutorDetails, averageRating: averageRating });
//   } catch (error) {
//     // err handling 
//     console.log('Error in tutorProfile:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });


app.get('/about/:name', async (req, res) => {

  try {
    // get tutor with a id from the params
    const tutorDetails = await db.one(`
      SELECT tutors.*, ROUND(AVG(ratings.rating), 2) as average_rating
      FROM tutors
      LEFT JOIN ratings ON tutors.id = ratings.tutor_id
      WHERE tutors.id = $1
      GROUP BY tutors.id
    `, [req.params.name]);
    const subjectsTutored = await db.any(`
      SELECT subjects.* as subTutored
      FROM subjects
      INNER JOIN tutor_subjects ON subjects.subject_id = tutor_subjects.subject_id
      WHERE tutor_subjects.tutor_id = $1
    `, [req.params.name]);
    const tutorsPosts = await db.any(`SELECT * FROM posts WHERE posts.fk_tutor_id = $1`, [req.params.name]); // used for getting the posts of the tutor
    // console.log('tutorPosts:', tutorsPosts); // used for debug
    // render page with given tutor
    res.render('./pages/about.hbs', { tutor: tutorDetails, subjects: subjectsTutored, posts: tutorsPosts});
  } catch (error) {
    // err handling 
    console.log('Error loading about', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/register', (req, res) => {
  res.render('./pages/register.hbs');
});
app.get('/registerInfoStudent', (req, res) => {
  res.render('./pages/registerInfoStudent.hbs');
});
app.get('/registerInfoTutor', (req, res) => {
  res.render('./pages/registerInfoTutor.hbs');
});

app.post('/login', async (req, res) => {
  if (!req.body.username || !req.body.password || !req.body.tutor_student_rad) {
      return res.status(400).send('Missing required field');
  }

  const username = req.body.username;
  const password = req.body.password;
  const userType = req.body.tutor_student_rad;

  try {
      let user, tableName;
      if (userType === "tutor") {
          userTutor = true;
          userStudent = false;
          tableName = 'tutors';
      } else {
          userStudent = true;
          userTutor = false;
          tableName = 'students';
      }

      user = await db.one(`SELECT * FROM ${tableName} WHERE username = $1 LIMIT 1;`, [username]);
      const match = await bcrypt.compare(password, user.password);

      if (match) {
          req.session.user = user;
          req.session.save();
          res.redirect('/discover');
      } else {
          res.render(`pages/login`, {
              error: true,
              message: "Incorrect password.",
          });
      }
  } catch (error) {
      res.render('pages/register', {
          error: true,
          message: "Username not found! Register here.",
      });
      }
});

app.get('/logout', (req, res) => {
  if (req.session) {
      req.session.destroy((err) => {
          if (err) {
              console.error('Error destroying session:', err);
              res.status(500).send('Internal Server Error');
          } else {
              res.render('pages/logout', {
                  message: "Logged out successfully!",
              });
          }
      });
  } else {
      res.render('pages/logout', {
          message: "No session to log out from.",
      });
  }
});



app.post('/register', async (req, res) => {
  if (!req.body.username || !req.body.password || !req.body.tutor_student_rad) {
    return res.status(400).send('Missing required field');
  }

  console.log('req.body: ', req.body);
  const hash = await bcrypt.hash(req.body.password, 10);

  if (req.body.tutor_student_rad == "tutor") {
    //The preemption logic makes sure that we don't try to make a INSERT query if the user already exists
    const preemptQuery = 'SELECT id FROM tutors WHERE username = $1';
    const preemptValue = [req.body.username];
    let preemptResponse = await db.any(preemptQuery, preemptValue);
    if (preemptResponse.length != 0) {//if we didn't recieve an error, that means the value already exists (bad)
      console.log('Error: This tutor already exists; cannot register.');
      res.render('pages/login', {
        error: true,
        message: "Looks like you already have an account! Try logging in.",
      });
    }
    else {
      const insertQuery = 'INSERT INTO tutors (username, password) VALUES ($1, $2)';
      const insertValues = [req.body.username, hash];
      // Execute the query
      let response = await db.any(insertQuery, insertValues);
      if (response.err) {
        console.log('Error: Could not insert into db - tutors table.');
        res.get('/register');
      }
      else {
        console.log('Success: User added to db - tutors table.');
        const user = await db.one('SELECT * FROM tutors WHERE username = $1 LIMIT 1;', [req.body.username]); //temporary forced login.
        req.session.user = user;
        req.session.save();
        res.redirect('/registerInfoTutor');
      }
    }
  }
  else {
    //The preemption logic makes sure that we don't try to make a INSERT query if the user already exists
    const preemptQuery = 'SELECT id FROM students WHERE username = $1';
    const preemptValue = [req.body.username];
    let preemptResponse = await db.any(preemptQuery, preemptValue);
    if (preemptResponse.length != 0) {//if we didn't recieve an error, that means the value already exists (bad)
      console.log('Error: This student already exists; cannot register.');
      res.redirect('pages/login', {
        error: true,
        message: "Looks like you already have an account! Try logging in.",
      });
    }
    else {
      const insertQuery = 'INSERT INTO students (username, password) VALUES ($1, $2)';
      const insertValues = [req.body.username, hash];
      // Execute the query
      let response = await db.any(insertQuery, insertValues);
      if (response.err) {
        console.log('Error: Could not insert into db - students table.');
        res.get('/register');
      }
      else {
        console.log('Success: User added to db - students table.');
        const user = await db.one('SELECT * FROM students WHERE username = $1 LIMIT 1;', [req.body.username]); //temporary forced login.
        req.session.user = user;
        req.session.save();
        res.redirect('/registerInfoStudent');
      }
    }
  }
});

// Authentication Middleware.
const auth = (req, res, next) => {
  if (!req.session.user) {
    // Default to login page.
    return res.redirect('/login?error=true&message=Please log in to continue.');
  }
  next();
};

app.use(auth);

app.get('/profile', async (req, res) => {
  // find the user currently logged in in the db
  let currUser;
  if (userTutor) {
    currUser = await db.one('SELECT * FROM tutors WHERE id = $1', [req.session.user.id]);
  }
  else {
    currUser = await db.one('SELECT * FROM students WHERE id = $1', [req.session.user.id]); 
  }
  // query db for all tutor names
  const tutors = await db.any('SELECT * FROM tutors');
  const tutorNames = tutors.map(tutor => tutor.first_name + ' ' + tutor.last_name);
  res.render('./pages/profile.hbs', {userStudent: userStudent, userTutor: userTutor, currUser: currUser, tutorNames: tutorNames});
});


app.get('/discover', async (req, res) => {
  try {
    const tutors = await db.any(`
      SELECT tutors.*, ROUND(AVG(ratings.rating), 2) as average_rating, array_agg(DISTINCT subjects.subject_name) as subjects
      FROM tutors
      LEFT JOIN ratings ON tutors.id = ratings.tutor_id
      LEFT JOIN tutor_subjects ON tutors.id = tutor_subjects.tutor_id
      LEFT JOIN subjects ON tutor_subjects.subject_id = subjects.subject_id
      GROUP BY tutors.id
      ORDER BY COALESCE(ROUND(AVG(ratings.rating), 2), 0) DESC, first_name ASC
    `);

    const tutorData = tutors.map(tutor => ({
      id: tutor.id,
      username: tutor.username,
      firstName: tutor.first_name,
      lastName: tutor.last_name,
      averageRating: tutor.average_rating,
      subjects: tutor.subjects
    }));

    res.render('pages/discover', { tutors: tutorData });
  } catch (error) {
    console.error(error);
    res.render('pages/discover', { tutors: [], message: 'An error occurred while fetching tutors.', error: true });
  }
});

app.post("/search", async (req, res) => {

  try {

    var tutors = await db.any(`
      SELECT tutors.*, ROUND(AVG(ratings.rating), 2) as average_rating, array_agg(DISTINCT subjects.subject_name) as subjects
      FROM tutors
      LEFT JOIN ratings ON tutors.id = ratings.tutor_id
      LEFT JOIN tutor_subjects ON tutors.id = tutor_subjects.tutor_id
      LEFT JOIN subjects ON tutor_subjects.subject_id = subjects.subject_id
      WHERE first_name ILIKE $1 OR last_name ILIKE $1
      GROUP BY tutors.id
      ORDER BY COALESCE(ROUND(AVG(ratings.rating), 2), 0) DESC, first_name ASC
    `, [req.body.search]);
    if (tutors.length != 0) {
      const tutorData = tutors.map(tutor => ({
        id: tutor.id,
        username: tutor.username,
        firstName: tutor.first_name,
        lastName: tutor.last_name,
        averageRating: tutor.average_rating,
        subjects: tutor.subjects
      }));

      res.render('pages/discover', { tutors: tutorData });
    }

    else {
      tutors = await db.any(`
        SELECT tutors.*, ROUND(AVG(ratings.rating), 2) as average_rating, array_agg(DISTINCT subjects.subject_name) as subjects
        FROM tutors
        INNER JOIN tutor_subjects ON tutors.id = tutor_subjects.tutor_id 
        INNER JOIN subjects ON tutor_subjects.subject_id = subjects.subject_id
        LEFT JOIN ratings ON tutors.id = ratings.tutor_id
        WHERE subjects.subject_name ILIKE $1
        GROUP BY tutors.id
        ORDER BY COALESCE(ROUND(AVG(ratings.rating), 2), 0) DESC, first_name ASC
      `, [req.body.search]);
      if (tutors) {

        const tutorData = tutors.map(tutor => ({
          id: tutor.id,
          username: tutor.username,
          firstName: tutor.first_name,
          lastName: tutor.last_name,
          averageRating: tutor.average_rating,
          subjects: tutor.subjects
        }));

        res.render('pages/discover', { tutors: tutorData });
      }

      else {
        error = true;
        res.redirect('/discover', { tutors: [], message: "No matching results found." });
      }
    }
  }
  catch (error) {

    console.error(error);
    res.render('pages/discover', { tutors: [], message: 'An error occurred while fetching tutors.', error: true });
  }
});



app.post('/registerInfoTutor', upload.single('uploaded_file'), async (req, res) => {

  const { first_name, last_name, email, topics } = req.body;
  const tutorId = req.session.user.id;

  try {

      await db.tx(async t => {

          if(req.file) {

            // Update tutors table if photo uploaded
            const filename = req.file.filename;
            await t.none('UPDATE tutors SET first_name = $1, last_name = $2, email = $3, img_url = $4 WHERE id = $5', [first_name, last_name, email, filename, tutorId]);
            console.log('Success: User modified - tutors table.');
          }

          else {

            // Update tutors table without photo uploaded
            await t.none('UPDATE tutors SET first_name = $1, last_name = $2, email = $3 WHERE id = $4', [first_name, last_name, email, tutorId]);
            console.log('Success: User modified - tutors table.');
          }

          // Insert new entries for selected subjects into tutor_subjects table using SQL join
          //console.log("Test")
          const insertQuery = `
            INSERT INTO tutor_subjects (subject_id, tutor_id)
            SELECT s.subject_id, $1 AS tutor_id
            FROM subjects s
            WHERE s.subject_name IN ($2:csv)
          `;
          await t.none(insertQuery, [tutorId, topics]);
          console.log('Success: Updated tutor_subjects table with new subjects');

      });

      req.session.destroy(); // log out and redirect to log in
      res.redirect('/login');
  } catch (error) {
      console.error('Error:', error.message);
      res.redirect('/register'); // redirect back to registration page in case of error
  }
});



app.post('/registerInfoStudent', async (req, res) => {


  console.log('req.body: ', req.body);
  console.log('req.session.user.id: ', req.session.user.id);

  //can add more
  const updateQuery = 'UPDATE students SET first_name = $1, last_name = $2, email = $3 WHERE id = ' + req.session.user.id; 
  const updateValues = [req.body.first_name, req.body.last_name, req.body.email];
  // Execute the query
  let response = await db.any(updateQuery, updateValues);
  if (response.err) {
    console.log('Error: Could not update - student table.');
    res.get('/register');
  }
  else {
    console.log('Success: User modified - students table.');
    req.session.destroy();
    res.redirect('/login');
  }
});

app.post('/updateProfilePhoto', upload.single('uploaded_file'), async (req,res) => {

  try {

    await db.tx(async t => {

    if(req.file) {

      console.log(req.file.filename);
      console.log(req.session.user.id);
      const id = req.session.user.id;
      const filename = req.file.filename;
      await t.none('UPDATE tutors SET img_url = $1 WHERE id = $2', [filename, id]);
    }

    res.redirect('/profile');
    });
  }

  catch {

    console.log('Error: Could not update profile photo');
  }
});

function getDayCol(day){
  // Get the current date
    const currentDate = day;
    // Calculate the start of the week (Sunday)
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() - 1);
    // Calculate the end of the week (Saturday)
    const endOfWeek = new Date(currentDate);
    endOfWeek.setDate(currentDate.getDate() + (6 - currentDate.getDay()));

    //determine all the days in between
    const mon = new Date(currentDate);
    mon.setDate(startOfWeek.getDate() + 1);
    const tue = new Date(currentDate);
    tue.setDate(startOfWeek.getDate() + 2);
    const wed = new Date(currentDate);
    wed.setDate(startOfWeek.getDate() + 3);
    const thu = new Date(currentDate);
    thu.setDate(startOfWeek.getDate() + 4);
    const fri = new Date(currentDate);
    fri.setDate(startOfWeek.getDate() + 5);

    // Format dates as YYYY-MM-DD for SQL queries
    const formattedStartOfWeek = startOfWeek.toISOString().slice(0, 10);
    const formattedMon = mon.toISOString().slice(0,10);
    const formattedTue = tue.toISOString().slice(0,10);
    const formattedWed = wed.toISOString().slice(0,10);
    const formattedThu = thu.toISOString().slice(0,10);
    const formattedFri = fri.toISOString().slice(0,10);
    const formattedEndOfWeek = endOfWeek.toISOString().slice(0, 10);
  //</date logic>

  var weekJson = {
    days: [
      { dayName: 'Sunday', date: formattedStartOfWeek },
      { dayName: 'Monday', date: formattedMon },
      { dayName: 'Tuesday', date: formattedTue },
      { dayName: 'Wednesday', date: formattedWed },
      { dayName: 'Thursday', date: formattedThu },
      { dayName: 'Friday', date: formattedFri },
      { dayName: 'Saturday', date: formattedEndOfWeek },
    ]
  };

  //debugging:
    // console.log('--------:getDayCol() return:--------');
    // console.log(weekJson);

  return weekJson;
}

function getTodayCol(){
  const todayDate = new Date();
  const weekDates = getDayCol(todayDate);
  return weekDates;
}

function getTodayWeekStartFormed(){
  const currentDate = new Date();
  // Calculate the start of the week (Sunday)
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() - 1);
  // Format dates as YYYY-MM-DD for SQL queries
  const formattedStartOfWeek = startOfWeek.toISOString().slice(0, 10);

  // console.log("Start of the week:", formattedStartOfWeek);

  return formattedStartOfWeek;
}

function getTodayWeekEndFormed(){
  const currentDate = new Date();
  // Calculate the end of the week (Saturday)
  const endOfWeek = new Date(currentDate);
  endOfWeek.setDate(currentDate.getDate() + (6 - currentDate.getDay()));
  // Format dates as YYYY-MM-DD for SQL queries
  const formattedEndOfWeek = endOfWeek.toISOString().slice(0, 10);

  // console.log("End of the week:", formattedEndOfWeek);

  return formattedEndOfWeek;
};

function synthesizeEvData (daysData, eventsOfTheWeek) {
  //debug
  // console.log('=========:DAYSDATA:=========',daysData,'=========END=========');
  // console.log('=========:EVENTSOFWEEK:=========',eventsOfTheWeek,'=========END=========');

  const finalProduct = daysData.days.map(day => ({
    dayName: day.dayName,
    date: day.date,
    events: eventsOfTheWeek.filter(event => {
      const eventDate = new Date(event.start_time).toISOString().slice(0, 10);
      return eventDate === day.date;
    }),
  }));

  //debug
    console.log('=========FINALPROD=========');
    finalProduct.forEach(day => {
      console.log(`${day.dayName} (${day.date}):`);
      day.events.forEach(event => {
        console.log(`Event ID: ${event.id}, Subject: ${event.subject}, Start Time: ${event.start_time}`);
      });
    });
    console.log('===========END===========');
  //end debug

  return finalProduct;
};

//This loads the  calendar page
app.get('/calendar', async (req, res) => {
  console.log('Running /calendar GET');

  const returnQuery = 'SELECT * FROM availabilities WHERE start_time >= $1 AND end_time <= $2';

  // Get this week's bookends (Sunday and Saturday)
  const formattedStartOfWeek = getTodayWeekStartFormed();
  const formattedEndOfWeek = getTodayWeekEndFormed();
  const bookends = [
    formattedStartOfWeek,
    formattedEndOfWeek
  ];

  try {
    let weeksEvents = await db.any(returnQuery, bookends);
    // console.log('-----------:DATA:-----------');
    // console.log(weeksEvents);
    ////////////////////////////////
    ////////////////////////////////
    /////CHANGE TO getDayCol()//////
    ////////////////////////////////
    ////////////////////////////////
    var synthedData = synthesizeEvData(getTodayCol(), weeksEvents);
    console.log('Success: Loading events.');
    res.render('pages/calendar', {synthedData});
  }
  catch (error) {
    console.log('ERROR: Could not load calendar.');
    res.render('pages/calendar', {message:'An error occurred while fetching this week\'s events.', error:true});
  }
});

app.post('/addCalendarEvent', async (req, res) => {
  console.log('Running /addCalendarEvent POST');
  // console.log('req.body: ', req.body);
  // console.log('req.session.user.id: ', async(req.session.user.id));

  /*************
   * 
   * 
   * 
   * 
   * NEED AUTHENTICATION MIDDLEWARE HERE
   * SO THAT ONLY A TUTOR CAN ADD AN 
   * AVAILABILITY TO THE CALENDAR
   * 
   * 
   * 
   * 
   * 
   */
  // if(this user is a tutor){
    const addAvailQuery = 'INSERT INTO availabilities (subject, start_time, end_time, fk_tutor_id) VALUES ($1,$2,$3,$4)';
    // const availVals = ['CHEM', '2024-04-18 13:30:00 -6:00', '2024-04-18 14:30:00 -6:00', 1];
    const reqFields = [
      req.body.evnt_subj,
      req.body.evnt_stime,
      req.body.evnt_etime,
      req.body.evnt_tutid
    ];

    const returnQuery = 'SELECT * FROM availabilities WHERE start_time >= $1 AND end_time <= $2';

    // Get THIS week's bookends (Sunday and Saturday)
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // CHANGE TO BE DAY DEPENDENT
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    const formattedStartOfWeek = getTodayWeekStartFormed();
    const formattedEndOfWeek = getTodayWeekEndFormed();
    const bookends = [
      formattedStartOfWeek,
      formattedEndOfWeek
    ];


    //Run queries
    try {
      await db.none(addAvailQuery, reqFields);
      console.log('Success: Event added.');

      try {
        let weeksEvents = await db.any(returnQuery, bookends);
        ////////////////////////////////
        ////////////////////////////////
        /////CHANGE TO getDayCol()//////
        ////////////////////////////////
        ////////////////////////////////
        var synthedData = synthesizeEvData(getTodayCol(), weeksEvents);
        // console.log('-----------:DATA:-----------');
        // console.log(weeksEvents);
        console.log('Success: Reloading page with new event.');
        res.render('pages/calendar', {synthedData});
      }
      catch (error) {
        console.log('ERROR: Could not reload page with new information.');
      }
    }
    catch (error) {
      console.error('ERROR: Could not insert event.', error);
    }
  // }

  // else if (user is logged in student){
    // STUFF TO MODIFY ENTRIES BY ADDING THEMSELVES AS THE 'BOOKEE', changing booked bool to true
  // }
});

app.post('/post', async (req, res) => {
  let currUser;
  if (userTutor){
    currUser = await db.one('SELECT * FROM tutors WHERE id = $1', [req.session.user.id]);
  }
  if (userStudent){
    currUser = await db.one('SELECT * FROM students WHERE id = $1', [req.session.user.id]);
  }
  const { title, content } = req.body;
  const tutorId = currUser.id;
  // Execute the query
  let response = await db.any('INSERT INTO posts (title, content, fk_tutor_id) VALUES ($1, $2, $3)', [title, content, tutorId]);
  if (response.err) {
    console.log('Error: Could not insert into db - posts table.');
    res.get('/profile');
  }
  else {
    console.log('Success: Post added to db - posts table.');
    res.redirect('/profile');
  }

});

app.post('/rateTutor', async (req, res) => {
  try {
      // Extract tutor name and rating from the request body
      const { tutorSelect, rating } = req.body;
      const [firstName, lastName] = tutorSelect.split(' ');
      const tutor = await db.oneOrNone('SELECT * FROM tutors WHERE first_name = $1 AND last_name = $2', [firstName, lastName]);
      await db.none('INSERT INTO ratings (tutor_id, student_id, rating) VALUES ($1, $2, $3)', [tutor.id, req.session.user.id, rating]);
      res.redirect('/profile');
  } catch (error) {
      console.error('Error rating tutor:', error);
      res.status(500).send("Failed to rate tutor.");
  }
});


module.exports = app.listen(3000);
console.log('Server is listening on port 3000');