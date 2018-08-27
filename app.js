const express = require('express');
const pg = require('pg');

const app = express();
const Pool = pg.Pool;

let useSSL = false;
let local = process.env.LOCAL || false;

if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/greet_app_database';

const pool = new Pool({
    connectionString,
    ssl: useSSL
});

app.get('/greeted', async function (req, res) {
    try {
        let keep = await pool.query('select * from users');
        let database = keep.rows;
        res.render('greeted', {database});
    } 
    catch (err) {
        
    }
});

app.listen(3000, function () {
    console.log('Strting port...'+ 3000);
})