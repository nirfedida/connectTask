//db.js
const sql = require('mssql');

const config = {
    user: 'DBuser',
    password: '123456',
    server: 'localhost',
    database: 'WebManagementDB',
    options: {
        trustServerCertificate: true
    }
};

let poolPromise;

async function getPool() {
    if (!poolPromise) {
        try {
            console.log('Connecting to the database...');
            poolPromise = sql.connect(config);
            console.log('Connected to the database.');
        } catch (err) {
            console.error('Database connection failed:', err);
            throw err;
        }
    }
    return poolPromise;
}

module.exports = { sql, getPool };
