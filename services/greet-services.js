module.exports = function(pool) {
    async function homePage(){
        let count = await pool.query('select count(DISTINCT users_greeted) FROM users');
        let counter = count.rows[0].count;
        return counter ;
    }

    return{
        homePage
    }
}