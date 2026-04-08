const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const db = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 1000,        // Самое безопасное значение для бесплатного хостинга
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});
/*
db.connect(err => {
    if (err) console.log(err.message);
    else console.log('db connected');
});
*/
db.getConnection((err, connection) => {
    if (err) {
        console.log('DB connection error:', err.message);
    } else {
        console.log('DB connected');
        connection.release(); // обязательно отпустить соединение
    }
});

module.exports = db;
