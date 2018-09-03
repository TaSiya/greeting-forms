const GreetServices = require('../services/greeting');

module.exports = function (pool) {
    const Greet = GreetServices(pool);

    async function home (req, res) {
        try {
            let counter = await Greet.countUsers();
            res.render('home', {counter});
        } catch (err) {

        }
    }
    async function resetRoot (req, res) {
        try {
            await Greet.reset();
            res.redirect('/');
        } catch (err) {
            next(err);
        }
    }
    async function remove (req, res) {
        try {
            let user = req.params.username;
            await Greet.removeUser(user);
            res.redirect('/greeted');
        } catch (err) {

        }
    }
    async function logicPost (req, res) {
        try {
            var flag = false;
            let input = req.body.name;
            let language = req.body.languageSelect;
            if (input !== '' && language !== undefined) {
                await Greet.tryingAddUser(input, language);
                flag = true;
            }
            var counter = await Greet.countUsers();
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
                await Greet.tryingAddUser(input, language);
                flag = true;
            }
            var counter = await Greet.countUsers();
            let message = language + ', ' + input;
            let namePlease = 'Please enter your name and select a language';
    
            res.render('home', {flag, message, namePlease, counter});
        } catch (err) {
    
        }
    }
    async function dataList (req, res) {
        try {
            let database = await Greet.allData();
            res.render('greeted', {database});
        } catch (err) {

        }
    }
    async function counterRoot (req, res) {
        try {
            let username = req.params.username;
            let user = await Greet.allData();
            let greetedUser = 0;
            for (var i = 0; i < user.length; i++) {
                if (user[i].users_greeted === username) {
                    greetedUser = await Greet.getCounter(username);
                }
            }
            res.render('counter', {username, greetedUser});
        } catch (err) {

        }
    }

    return {
        home,
        resetRoot,
        remove,
        logicPost,
        logicGet,
        dataList,
        counterRoot
    }
}