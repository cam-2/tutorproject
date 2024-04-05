const express = require('express'); // To build an application server or API
const app = express();
const handlebars = require('express-handlebars'); //giving error worry later
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
app.set('Scenes', path.join(__dirname, 'Scenes'));
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.get('/welcome', (req, res) => {
  res.json({ status: 'success', message: 'Welcome!' });
});

app.get('/', (req, res) => {
  console.log("Calling here!");
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
  const hash = await bcrypt.hash(req.body.password, 10);

  const insertQuery = 'INSERT INTO students (subject_id, review_id, username, first_name, last_name, email, password, year, major) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
  const insertValues = [req.body.subject_id, req.body.review_id, req.body.username, req.body.first_name, req.body.last_name, req.body.email, hash, req.body.year, req.body.major];
  try {
    await db.any(insertQuery, insertValues);
    console.log('Success: User added to db.');
    // res.redirect('/login');
    res.json({ status: 'success', message: 'Registered!' });
  } catch (err) {
    console.log('Error: Could not insert into db.');
    // res.redirect('/register');
    res.json({ status: 'fail', message: 'Invalid registration!' });
  }
});

module.exports = app.listen(3000);
console.log('Server is listening on port 3000');