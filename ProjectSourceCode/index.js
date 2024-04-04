const express = require('express'); // To build an application server or API
const app = express();
//const handlebars = require('express-handlebars'); //giving error worry later
//const Handlebars = require('handlebars');
const path = require('path');
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords
const { name } = require('body-parser');
const json = require('body-parser/lib/types/json');


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

app.use(
session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
})
);

app.get('/', (req, res) => {
    res.redirect('/loginStudent'); //this will call the /login route in the API
});

app.get('/loginStudent', (req, res) => {
    res.render('Scenes/loginStudent');
});

app.get('/registerStudent', (req, res) => {
    res.render('Scenes/registerStudent');
});

app.listen(3000);
console.log('Server is listening on port 3000');