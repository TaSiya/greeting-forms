'use strict';
const express = require('express');
const flash = require('express-flash');
const session = require('express-session');
const handle = require('express-handlebars');
const bodyParser = require('body-parser');
const pg = require("pg");
const greet = require('./greet');
 

var Igreet = greet();
const app = express();
const Pool = pg.Pool;

app.use(express.static(__dirname + 'public'));

let useSSL = false;
let local = process.env.LOCAL || false;

if (process.env.DATABASE_URL && !local){
    useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://tasiya:#B712#@localhost:2018/users';

const pool = new Pool({
    connectionString,
    ssl : useSSL
  });



app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());
app.engine('handlebars', handle({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');



app.get('/', function(req, res){
    let counter = Igreet.getCount();
    res.render('home', {counter});
})

// Greet the user using the form field
app.post('/greetings/', function(req, res){
    let input = req.body.name;
    let language = req.body.languageSelect;
    if(language !== undefined && input !== ''){
        var flag = Igreet.checked(input);
    }
    var counter = Igreet.getCount();
    let message = language +", "+ input;
    let namePlease = "Please enter your name and select a language";
    res.render('home',{flag,message,namePlease, counter});
});

// Allows the user to be greeted using the URL. But the language is not set, so i use default "Good day"
app.get('/greetings/:name', function(req, res){
    let input = req.params.name;
    let flag = Igreet.checked(input);
    let message = "Good day "+ input;
    let counter = Igreet.getCount();
    res.render('home',{flag, input, message, counter});
})



const PORT = process.env.PORT || 2018;
app.listen(PORT, function(){
    console.log('Listening to port....'+PORT);
});