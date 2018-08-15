const express = require('express');
const handle = require('express-handlebars');
const bodyParser = require('body-parser');
const greet = require('./greet');

var Igreet = greet();
const app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

app.engine('handlebars', handle({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function(req, res){
    let counter = Igreet.getCount();
    res.render('home', {counter});
})

app.post('/greetings/', function(req, res){
    let input = req.body.name;
    let language = req.body.languageSelect;
    let flag = Igreet.checked(input);
    let counter = Igreet.getCount();
    if(language === undefined){
        flag = false;
    }
    let message = language +", "+ input;
    let namePlease = "Please enter your name and select a language";
    res.render('home',{flag,message,namePlease, counter});
});

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