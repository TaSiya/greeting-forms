let greetService = require('../services/greeting');
const assert = require('assert');

const pg = require('pg');
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
describe('Greeting App test for both front-end and back-ends', function () {
    describe('Count the number of users added', function () {
        beforeEach(async function () {
            await pool.query('delete from users;');
        });
        it('No data should return 0', async function () {
            // each test must have its own pool.
            let greet = greetService(pool);    
            assert.strictEqual(await greet.countUsers(), 0);
        });
        beforeEach(async function () {
            await pool.query('delete from users');
        });
        it('No data should return 2', async function () {
            // each test must have its own pool.
            let greet = greetService(pool);    
            await greet.tryingAddUser('siyanda', 'hello')
            await greet.tryingAddUser('odwa', 'hello');
            assert.strictEqual(await greet.countUsers(), 2);
        });
        beforeEach(async function () {
            await pool.query('delete from users');
        });
        it('No data should return 6', async function () {
            // each test must have its own pool.
            let greet = greetService(pool);    
            await greet.tryingAddUser('siyanda', 'hello');
            await greet.tryingAddUser('odwa', 'molo');
            await greet.tryingAddUser('pam', 'hello');
            await greet.tryingAddUser('mama', 'hello');
            await greet.tryingAddUser('landa', 'molo');
            await greet.tryingAddUser('daddy', 'hello');
            assert.strictEqual(await greet.countUsers(), 6);
        });
        
    });
    
    describe('select specific user', function () {
        beforeEach(async function () {
            await pool.query('delete from users');
        });
        it('should return siyanda', async function () {
            let greet = greetService(pool);
            await greet.tryingAddUser('odwa', 'molo');
            await greet.tryingAddUser('pam', 'molo');
            await greet.tryingAddUser('siyanda', 'hello');
            let user = await greet.selectSpecific('siyanda');
            assert.strictEqual(user[0].users_greeted, 'siyanda');
        });
        beforeEach(async function () {
            await pool.query('delete from users');
        });
        it('should return pam', async function () {
            let greet = greetService(pool);
            await greet.tryingAddUser('odwa', 'molo');
            await greet.tryingAddUser('pam', 'molo');
            await greet.tryingAddUser('siyanda', 'hello');
            let user = await greet.selectSpecific('pam');
            assert.strictEqual(user[0].users_greeted, 'pam');
        });
    });
    describe('reset/clear the database', function () {
        beforeEach(async function () {
            await pool.query('delete from users');
        });
        it('reset the database', async function () {
            let greet = greetService(pool);    
            await greet.tryingAddUser('siyanda', 'hello');
            await greet.tryingAddUser('odwa', 'molo');
            await greet.tryingAddUser('pam', 'hello');
            await greet.tryingAddUser('mama', 'hello');
            await greet.tryingAddUser('landa', 'molo');
            await greet.tryingAddUser('daddy', 'hello');
            await greet.reset();
            assert.deepStrictEqual(await greet.allData(), []);
        });
    });
    describe('update the counter', function () {
        beforeEach(async function () {
            await pool.query('delete from users');
        });
        it('increment for the user siyanda => 3', async function () {
            let greet = greetService(pool);    
            await greet.tryingAddUser('siyanda', 'hello');
            await greet.tryingAddUser('odwa', 'molo');
            await greet.tryingAddUser('siyanda', 'hello');
            await greet.tryingAddUser('mama', 'hello');
            await greet.tryingAddUser('siyanda', 'molo');
            await greet.tryingAddUser('daddy', 'hello');
            let counter = await greet.getCounter('siyanda');
            assert.strictEqual(counter, 3);
        });
        beforeEach(async function () {
            await pool.query('delete from users');
        });
        it('increment for the user mama => 2', async function () {
            let greet = greetService(pool);    
            await greet.tryingAddUser('siyanda', 'hello');
            await greet.tryingAddUser('mama', 'molo');
            await greet.tryingAddUser('siyanda', 'hello');
            await greet.tryingAddUser('mama', 'hello');
            await greet.tryingAddUser('siyanda', 'molo');
            await greet.tryingAddUser('daddy', 'hello');
            let counter = await greet.getCounter('mama');
            assert.strictEqual(counter, 2);
        });
    });
    after(function () {
        pool.end();
    });
});
