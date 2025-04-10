const { Pool } = require('pg');
const connexion = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'bank',
    password: 'test1518',
    port: 5432
});

module.exports = connexion;