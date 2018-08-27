'use strict';
const express = require('express');
const flash = require('express-flash');
const session = require('express-session');
const handle = require('express-handlebars');
const bodyParser = require('body-parser');
const pg = require('pg');
const greet = require('./greet');
var Igreet = greet();
const app = express();
const Pool = pg.Pool;

app.use(express.static(__dirname + 'public'));

let useSSL = false;
let local = process.env.LOCAL || false;

if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/greet_app_database';

const pool = new Pool({
    connectionString,
    ssl: useSSL
});
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.engine('handlebars', handle({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', async function (req, res) {
    try {
        let count = await pool.query('select count(DISTINCT users_greeted) FROM users');
        let counter = count.rows[0].count;
        res.render('home', {counter});
    } catch (err) {
        
    }
    
});

// Greet the user using the form field
app.post('/greetings', async function (req, res) {
    // let input = req.body.name;
    // let language = req.body.languageSelect;
    // let userData = await pool.query('select * from users where users_greeted = $1', [input]);
    // console.log(userData.rows[0]);
    // if (userData.rows[0] === '' || userData.rows[0]) {

    // }
    // if (language !== undefined && input !== '') {
    //     var flag = Igreet.checked(input);
    //     pool.query('insert into users (users_greeted, user_language) values ($1,$2)', [input, language]);
    // }
    // var count = await pool.query('select count(DISTINCT users_greeted) from users');
    // let counter = count.rows[0].count;
    // let message = language + ', ' + input;
    // let namePlease = 'Please enter your name and select a language';


        


    try {
        var flag;
        let input = req.body.name;
        let language = req.body.languageSelect;
        if (input !== '' && language !== undefined) {
            console.log('here');
            let user = await pool.query('SELECT * FROM users ');
            console.log(user.rows[2]);
            let found = false;
            for (var i = 0; i < user.rows.length; i++) {
                if (user.rows[i].users_greeted === input) {
                    found = true;
                    let incrementCount = user.rows[i].counter + 1;
                    let id = user.rows[i].id;
                    await pool.query('UPDATE users SET user_language = $1, counter = $2  WHERE id=$3', [language, incrementCount, id]);
                }
            }
            if (!found) {
                await pool.query('INSERT INTO users (users_greeted, user_language, counter) values ($1, $2,$3)', [input, language, 1]);  
            } 
            flag = Igreet.checked(input);
        }
        var count = await pool.query('select count(DISTINCT users_greeted) from users');
        let counter = count.rows[0].count;
        
        let message = language + ', ' + input;
        let namePlease = 'Please enter your name and select a language';

        res.render('home', {flag: true, message, namePlease, counter});
    } catch (err) {

    }

    
});

// Allows the user to be greeted using the URL. But the language is not set, so i use default "Good day"
app.get('/greetings/:name', function (req, res) {
    let input = req.params.name;
    let flag = Igreet.checked(input);
    let message = 'Good day ' + input;
    let counter = Igreet.getCount();
    res.render('home', {flag, input, message, counter});
});

app.get('/greeted', async function (req, res) {
    try {
        let allUsers = await pool.query('select *  from users');
        let database = allUsers.rows;
        res.render('greeted', {database});
    } catch (err) {
        res.send(err.stack);
    }
});

app.get('/counter/:username', async function (req, res) {
    let username = req.params.username;
    let user = await pool.query('SELECT * FROM users ');
    let found = false;
    let greetedUser = 0;
        for (var i = 0; i < user.rows.length; i++) {
            if (user.rows[i].users_greeted === username) {
                found = true;
                greetedUser = await pool.query('SELECT counter FROM users WHERE users_greeted = $1', [username]);
                greetedUser = greetedUser.rows[0].counter;
            }
        }
    res.render('counter', {username, greetedUser});
});

const PORT = process.env.PORT || 2018;
app.listen(PORT, function () {
    console.log('Listening to port....' + PORT);
});
