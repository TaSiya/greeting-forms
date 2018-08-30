module.exports = function (pool) {
    async function allData () {
        let data = await pool.query('select * from users');
        return data.rows;
    }
    async function selectSpecific (user) {
        let userData = await pool.query('select * from users WHERE users_greeted = $1', [user]);
        return userData.rows[0];
    }
    async function selectById (id) {
        let user = await pool.query('SELECT * FROM users WHERE id=$1', [id]);
        return user.rows[0];
    }
    async function countUsers () {
        let numberUser = await pool.query('SELECT count(*) FROM users');
        return numberUser.rows[0];
    }
    async function insertData (name, language) {
        await pool.query('insert into users (users_greeted,user_language,counter) values ($1,$2,$3)', [name, language, 1]);
    }
    
    async function incrementCount (name, language) {
        let currentCount = await pool.query('SELECT counter FROM users WHERE users_greeted = $1', [name]);
        let newCount = currentCount.rows[0].counter + 1;
        insertData(name, language, newCount);
    }
    async function reset () {
        await pool.query('delete from users');
    }
    async function update() {
        await pool.query('UPDATE users SET user_language = $1, counter = $2 WHERE id=$3', []);
    }
    async function tryingAddUser (name, language) {
        let allUsers = allData();
        let found = false;
        for (var i = 0; i < allUsers.length; i++) {
            if (name === allUsers[i].users_greeted) {
                incrementCount(name, language);
                found = true;
            }
        }
        if (!found) {
            insertData(name, language);
        }

        return found;
    }
    return {
        allData,
        selectSpecific,
        selectById,
        countUsers,
        insertData,
        incrementCount,
        reset,
        tryingAddUser
    }
}