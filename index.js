const express = require('express');
const handle = require('express-handlebars');
const bodyParser = require('body-parser');
const greet = require('./greet');

const app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

app.engine('handlebars', handle({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function(req, res){
    
    res.render('home',);
})

app.get('/greetings', function(req, res){
    let name = req.params.input;
    console.log(name);
    let message = "Good day";

    res.render('home', {message});
})

const PORT = process.env.PORT || 2018;

app.listen(PORT, function(){
    console.log('Listening to port....'+PORT);
});