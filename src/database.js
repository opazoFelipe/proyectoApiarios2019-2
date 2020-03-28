const mysql = require('mysql');
const {promisify} = require('util');

const { database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if(err) {
        console.error(err.code);
        return;
    }

    // Utilizar el metodo release de connection
    if(connection) {
        // console.log('LA BASE DE DATOS ESTÁ CONECTADA');
        connection.release();
    }
    
    return;
});

// Convertir callbacks en promesas
// pool.query = promisify(pool.query);
promisify(pool.query)

module.exports = pool;
