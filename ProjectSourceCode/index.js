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


const hbs = handlebars.create({
  extname: 'hbs',
  layoutsDir: __dirname + '/views/layouts', //not used rn
  partialsDir: __dirname + '/views/partials', //not used rn
});

// database configuration
const dbConfig = {
  host: 'db', // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

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

app.get('/welcome', (req, res) => {
  res.json({ status: 'success', message: 'Welcome!' });
});

app.get('/', (req, res) => {
  // console.log("Calling here!");
  res.redirect('/landing');
});

app.get('/loginStudent', (req, res) => {
  res.render('./pages/loginStudent.hbs');
});
app.get('/loginTutor', (req, res) => {
  res.render('./pages/loginTutor.hbs');
});

app.get('/landing', (req, res) => {
  res.render('./pages/landingPage.hbs');
});

app.get('/discover', async (req, res) => {
  try {
    const tutors = await db.any(`
      SELECT tutors.*, ROUND(AVG(ratings.rating), 2) as average_rating
      FROM tutors
      LEFT JOIN ratings ON tutors.id = ratings.tutor_id
      GROUP BY tutors.id
      ORDER BY COALESCE(ROUND(AVG(ratings.rating), 2), 0) DESC, first_name ASC
    `);

    const tutorData = tutors.map(tutor => ({
      id: tutor.id,
      username: tutor.username,
      firstName: tutor.first_name,
      lastName: tutor.last_name,
      averageRating: tutor.average_rating
    }));

    res.render('pages/discover', { tutors: tutorData });
  } catch (error) {
    console.error(error);
    res.render('pages/discover', { tutors: [], message: 'An error occurred while fetching tutors.', error: true });
  }
});

// // function used for getting the average rating of a tutor
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
    // render page with given tutor
    res.render('./pages/about.hbs', { tutor: tutorDetails });
  } catch (error) {
    // err handling 
    console.log('Error loading about', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/profile', (req, res) => {
  res.render('./pages/profile.hbs');
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

app.post('/loginStudent', async (req, res) => {

  // Find the user based on the entered username
  try {
    const user = await db.one('SELECT * FROM students WHERE username = $1 LIMIT 1;', [req.body.username]);
    try {

      const password = req.body.password;;
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        // Save user details in the session
        req.session.user = user;
        req.session.save();
        res.redirect('/discover'); //or whatever landing page? Calendar maybe?
      } else {
        // Incorrect password
        res.render('pages/loginStudent', {
          error: true,
          message: "Incorrect password.",
        });
      }
    } catch (error) { //should not happen
      console.error('Error during password comparison:', error);
      res.status(500).send('Internal Server Error');
    }
  } catch (error) {
    res.render('pages/register', {
      error: true,
      message: "Username not found! Register here.",
    });
  }
});

app.post('/loginTutor', async (req, res) => {

  // Find the user based on the entered username
  try {
    const user = await db.one('SELECT * FROM tutors WHERE username = $1 LIMIT 1;', [req.body.username]);
    try {

      const password = req.body.password;;
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        // Save user details in the session
        req.session.user = user;
        req.session.save();
        res.redirect('/discover'); //or whatever landing page? Calendaar maybe?
      } else {
        // Incorrect password
        res.render('pages/loginTutor', {
          error: true,
          message: "Incorrect password.",
        });
      }
    } catch (error) { //should not happen
      console.error('Error during password comparison:', error);
      res.status(500).send('Internal Server Error');
    }
  } catch (error) {
    res.render('pages/register', {
      error: true,
      message: "Username not found! Register here.",
    });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.render('pages/logout', {
    message: "Was able to logout successfully!",
  });
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
      res.render('pages/loginTutor', {
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
      res.redirect('pages/loginStudent', {
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

app.post("/search", async (req, res) => {

  try {

    var tutors = await db.any(`
      SELECT tutors.*, ROUND(AVG(ratings.rating), 2) as average_rating
      FROM tutors
      LEFT JOIN ratings ON tutors.id = ratings.tutor_id
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
        averageRating: tutor.average_rating
      }));

      res.render('pages/discover', { tutors: tutorData });
    }

    else {
      tutors = await db.any(`
        SELECT tutors.*, ROUND(AVG(ratings.rating), 2) as average_rating
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
          averageRating: tutor.average_rating
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


// Authentication Middleware.
const auth = (req, res, next) => {
  if (!req.session.user) {
    // Default to login page.
    return res.redirect('/loginTutor');
  }
  next();
};

app.use(auth);


app.post('/registerInfoTutor', async (req, res) => {
  console.log('req.body: ', req.body);
  console.log('req.session.user.id: ', req.session.user.id);

  const { first_name, last_name, email, topics } = req.body;
  const tutorId = req.session.user.id;

  try {
      await db.tx(async t => {
          // Update tutors table
          await t.none('UPDATE tutors SET first_name = $1, last_name = $2, email = $3 WHERE id = $4', [first_name, last_name, email, tutorId]);
          console.log('Success: User modified - tutors table.');

          // Insert new entries for selected subjects into tutor_subjects table using SQL join
          console.log("Test")
          //if (subjects && subjects.length > 0) {
              const insertQuery = `
                INSERT INTO tutor_subjects (subject_id, tutor_id)
                SELECT s.subject_id, $1 AS tutor_id
                FROM subjects s
                WHERE s.subject_name IN ($2:csv)
              `;
              console.log("Got here");
              await t.none(insertQuery, [tutorId, topics]);
              console.log('Success: Updated tutor_subjects table with new subjects');
          //}
      });

      req.session.destroy(); // log out and redirect to log in
      res.redirect('/loginTutor');
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
    res.redirect('/loginStudent');
  }
});

/////////////////////////// CALENDAR RELATED FUNCTIONS ///////////////////////////
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
}

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
}

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
////////////////////////////// END CALENDAR FUNCTIONS ///////////////////////////


// app.post('/removeTests', async (req, res) => {
//   const removeTQuery = 'DELETE FROM tutors WHERE username = $1';
//   const removeSQuery = 'DELETE FROM students WHERE username = $1';
//   const uname = 'johndoe';

//   let response = await db.any(removeTQuery, uname);
//   if(response.err){
//     console.log('Error: Could not remove test tutor: johndoe from table: tutors');
//     res.set('pages/register', {error: true, message: "Error: Could not remove."});
//   }
//   else{
//     console.log('Success: Removed test tutor: johndoe from table: tutors');
//     let response = await db.any(removeSQuery, uname);
//     if(response.err){
//       console.log('Error: Could not remove test student: johndoe from table: students');
//       res.set('pages/register', {error: true, message: "Error: Could not remove."});
//     }
//     else{
//       console.log('Success: Removed test student: johndoe from table: students');
//       res.set('pages/register', {error: false, message: "Successfully removed."});
//     }
//   }
// });

module.exports = app.listen(3000);
console.log('Server is listening on port 3000');
