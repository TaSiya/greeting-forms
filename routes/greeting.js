const greet = require('../greet');
const greetServices = require('./services/greet-services');
const greetInstance = greet();
const greetService = greetServices();
module.exports = function greet_services() {
    function showHome(req, res, next) {
        try{
            let counter = 
            res.render('home', {counter});
        }catch(err){
            next(err);
        }
        
    }

    
    return{
        showHome
    }
}