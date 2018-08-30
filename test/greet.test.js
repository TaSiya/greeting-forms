let greetService = require('../services/greeting');
const assert = require('assert');

const pg = require('pg');
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/greet_app_database';

const pool = new Pool({
    connectionString
});

describe('Greeting App test for both from and back ends', async function () {
    beforeEach(async function () {
        await pool.query('delete from users');
    });
    it('should return length 0 with no data', async function () {
        const greetInstance = greetService(pool);    
        let result = await greetInstance.allData();
        assert.strictEqual(result.length, 0);
    });

    after(function () {
        pool.end();
    });
});
