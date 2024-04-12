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

const db = pgp(dbConfig);
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

async function getTutorAverageRating(tutorId) {
  try {
    // get avg rating from ratings table for the tutor  
    const result = await db.oneOrNone('SELECT AVG(rating) as average_rating FROM ratings WHERE tutor_id = $1', [tutorId]);  
    // check if the result and avg are not empty
    if (result && result.average_rating) return parseFloat(result.average_rating).toFixed(2);
    // else return 'No ratings yet'
    else return 'No ratings yet';
  } catch (error) {
    // err handling
    console.log('Error getting rating:', error);
    throw error;
  }
}

app.get('/tutorProfile/:tutorId', async (req, res) => {
  const tutorId = req.params.tutorId;
  try {
    // get tutor given an id
    const tutorDetails = await db.one('SELECT * FROM tutors WHERE id = $1', [tutorId]);
    // calc avg rating for a tutor
    const averageRating = await getTutorAverageRating(tutorId);
    // render page with given tutor and rating
    res.render('./pages/tutorProfile.hbs', { tutor: tutorDetails, averageRating: averageRating });
  } catch (error) {
    // err handling 
    console.log('Error in tutorProfile route:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/welcome', (req, res) => {
  res.json({ status: 'success', message: 'Welcome!' });
});

app.get('/', (req, res) => {
    // console.log("Calling here!");
    res.redirect('/register'); //this will call the /login route in the API
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

app.get('/discover', (req, res) => {
  res.render('./pages/discover.hbs');
});

app.get('/profile', (req, res) => {
  res.render('./pages/profile.hbs');
});

app.get('/about', (req, res) => {
  res.render('./pages/about.hbs');
});

app.get('/register', (req, res) => {
  res.render('./pages/register.hbs');
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
          res.redirect('/discover'); //or whatever landing page? Calendaar maybe?
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



app.post('/register', async (req, res) => {
  if (!req.body.username || !req.body.password || !req.body.tutor_student_rad) {
    return res.status(400).send('Missing required field');
  }
  
  console.log('req.body: ', req.body);
  const hash = await bcrypt.hash(req.body.password, 10);

  if(req.body.tutor_student_rad == "tutor"){
    const insertQuery = 'INSERT INTO tutors (username, password) VALUES ($1, $2)';
    const insertValues = [req.body.username, hash];
    // Execute the query
    let response = await db.any(insertQuery, insertValues);
    if(response.err) {
      console.log('Error: Could not insert into db - tutors table.');
      res.get('/register');
    }
    else {
      console.log('Success: User added to db - tutors table.');
      res.redirect('/loginTutor');
    }
  }
  else{
    const insertQuery = 'INSERT INTO students (username, password) VALUES ($1, $2)';
    const insertValues = [req.body.username, hash];
    // Execute the query
    let response = await db.any(insertQuery, insertValues);
    if(response.err) {
      console.log('Error: Could not insert into db - students table.');
      res.get('/register');
    }
    else {
      console.log('Success: User added to db - students table.');
      res.redirect('/loginStudent');
    }
  }
});

module.exports = app.listen(3000);
console.log('Server is listening on port 3000');