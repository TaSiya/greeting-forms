'use strict';
const express = require('express');
const flash = require('express-flash');
const session = require('express-session');
const handle = require('express-handlebars');
const bodyParser = require('body-parser');
const greetServices = require('./services/greeting');
const greetRoute = require('./routes/greeting');
const pg = require('pg');


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

const greetRoutes = greetRoute(pool);

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.engine('handlebars', handle({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
//home root
app.get('/', greetRoutes.home);
// reset the database
app.get('/reset', greetRoutes.resetRoot);
// Greet the user using the form field
app.post('/greetings', greetRoutes.logicPost);
// Allows the user to be greeted using the URL. But the language is not set, so i use default "Good day"
app.get('/greetings/:name/:language', greetRoutes.logicGet);
//link to all users in the database
app.get('/greeted', greetRoutes.dataList);
//counter root for each user
app.get('/counter/:username', greetRoutes.counterRoot);
//listining port for the app
const PORT = process.env.PORT || 2018;
app.listen(PORT, function () {
    console.log('Listening to port....' + PORT);
});
