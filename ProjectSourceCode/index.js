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
      const user = await db.one('SELECT * FROM tutors WHERE username = $1 LIMIT 1;', [req.body.username]); //temporary forced login.
      req.session.user = user;
      req.session.save();
      res.redirect('/registerInfoTutor');
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
      const user = await db.one('SELECT * FROM students WHERE username = $1 LIMIT 1;', [req.body.username]); //temporary forced login.
      req.session.user = user;
      req.session.save();
      res.redirect('/registerInfoStudent');
    }
  }
});


app.post('/registerInfoTutor', async (req, res) => {
  
  
  console.log('req.body: ', req.body);
  console.log('req.session.user.id: ', req.session.user.id);

  //can add more
  const updateQuery = 'UPDATE tutors SET first_name = $1, last_name = $2, email = $3 WHERE id = ' + req.session.user.id; //Should work? need to test
  const updateValues = [req.body.first_name, req.body.last_name, req.body.email];
  // Execute the query
  let response = await db.any(updateQuery, updateValues);
  if(response.err) {
    console.log('Error: Could not update - tutors table.');
    res.get('/register');
  }
  else {
    console.log('Success: User modified - tutors table.');
    res.redirect('/loginTutor');
  }
});

app.post('/registerInfoStudent', async (req, res) => {
  
  
  console.log('req.body: ', req.body);
  console.log('req.session.user.id: ', req.session.user.id);

  //can add more
  const updateQuery = 'UPDATE students SET first_name = $1, last_name = $2, email = $3 WHERE id = ' + req.session.user.id; //Should work? need to test
  const updateValues = [req.body.first_name, req.body.last_name, req.body.email];
  // Execute the query
  let response = await db.any(updateQuery, updateValues);
  if(response.err) {
    console.log('Error: Could not update - student table.');
    res.get('/register');
  }
  else {
    console.log('Success: User modified - students table.');
    res.redirect('/loginStudent');
  }
});

module.exports = app.listen(3000);
console.log('Server is listening on port 3000');