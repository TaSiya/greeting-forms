const greetServices = require('../services/greeting');

module.exports = function (pool) {
    const greet = greetServices(pool);

    async function home (req, res) {
        try {
            let counter = await greet.countUsers();
            res.render('home', {counter});
        } catch (err) {

        }
    }
    async function resetRoot (req, res) {
        try {
            await greet.reset();
            res.redirect('/');
        } catch (err) {
            next(err);
        }
    }
    async function logicPost (req, res) {
        try {
            var flag = false;
            let input = req.body.name;
            let language = req.body.languageSelect;
            if (input !== '' && language !== undefined) {
                await greet.tryingAddUser(input, language);
                flag = true;
            }
            var counter = await greet.countUsers();
            let message = language + ', ' + input;
            let namePlease = 'Please enter your name and select a language';
    
            res.render('home', {flag, message, namePlease, counter});
        } catch (err) {
    
        }
    }

    async function logicGet (req, res) {
        try {
            var flag = false;
            let input = req.params.name;
            let language = req.params.language;
            if (input !== '' && language !== undefined) {
                await greet.tryingAddUser(input, language);
                flag = true;
            }
            var counter = await greet.countUsers();
            let message = language + ', ' + input;
            let namePlease = 'Please enter your name and select a language';
    
            res.render('home', {flag, message, namePlease, counter});
        } catch (err) {
    
        }
    }
    async function dataList (req, res) {
        try {
            let database = await greet.allData();
            res.render('greeted', {database});
        } catch (err) {

        }
    }
    async function counterRoot (req, res) {
        try {
            let username = req.params.username;
            let user = await greet.allData();
            let greetedUser = 0;
            for (var i = 0; i < user.length; i++) {
                if (user[i].users_greeted === username) {
                    greetedUser = await greet.getCounter(username);
                }
            }
            res.render('counter', {username, greetedUser});
        } catch (err) {

        }
    }

    return {
        home,
        resetRoot,
        logicPost,
        logicGet,
        dataList,
        counterRoot
    }
}