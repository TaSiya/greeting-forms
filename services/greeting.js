module.exports = function (pool) {
    async function allData () {
        let data = await pool.query('select * from users');
        return data.rows;
    }
    async function selectSpecific (user) {
        let userData = await pool.query('select * from users WHERE users_greeted = $1;', [user]);
        return userData.rows;
    }
    async function selectById (id) {
        let user = await pool.query('SELECT * FROM users WHERE id=$1', [id]);
        return user.rows;
    }
    async function getCounter (name) {
        let counter = await pool.query('SELECT counter FROM users WHERE users_greeted = $1', [name]);
        return parseInt(counter.rows[0].counter);
    }
    async function countUsers () {
        let numberUser = await pool.query('SELECT count(*) FROM users;');
        return parseInt(numberUser.rows[0].count);
    }
    async function insertData (name, language) {
        await pool.query('INSERT INTO users (users_greeted,user_language,counter) VALUES ($1,$2,$3);', [name, language, 1]);
    }
    async function incrementCount (name, language) {
        let currentUser = await pool.query('SELECT * FROM users WHERE users_greeted = $1', [name]);
        let newCount = currentUser.rows[0].counter + 1;
        await update(language, newCount, currentUser.rows[0].id);
    }
    async function reset () {
        await pool.query('delete from users');
    }
    async function update (language, count, id) {
        await pool.query('UPDATE users SET user_language = $1, counter = $2 WHERE id=$3', [language, count, id]);
    }
    async function tryingAddUser (name, language) {
        let allUsers = await allData();
        
        let found = false;
        for (var i = 0; i < allUsers.length; i++) {
            if (name === allUsers[i].users_greeted) {
                await incrementCount(name, language);
                found = true;
            }
        }
        if (!found) {
            await insertData(name, language);
        }

        return found;
    }
    return {
        allData,
        selectSpecific,
        selectById,
        getCounter,
        countUsers,
        insertData,
        incrementCount,
        reset,
        tryingAddUser
    }
}