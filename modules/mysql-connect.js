require('dotenv').config();

const mysql = require('mysql2');


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    // 最大連線
    connectionLimit: 5,
    // 限制排隊數量,0無限制
    queueLimit: 0,
});
// 除錯用的資訊,連線時顯示
console.log({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

module.exports = pool.promise();