const mysql = require('mysql')

const pool = mysql.createPool({
    connectionLimit: 10,
    host: '10.10.10.29',
    user: 'radius',
    password: '$Clicnet#',
    database: 'radius'
})

module.exports = pool
