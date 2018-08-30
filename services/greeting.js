module.exports = function (pool) {
    async function allData () {
        let data = await pool.query('select * from users');
        return data.rows;
    }
    return {
        allData
    }
}