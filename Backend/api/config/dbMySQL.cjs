const mysql = require('mysql');
require('dotenv').config()
const dbConn = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_NAME,
});

dbConn.connect((err) => {
    if (!err) {
        console.log("Database Connected.");
    } else {
        console.log("Database Connection Failed ! \n Error:" + JSON.stringify(err, undefined, 2));
        return;
    }
});

module.exports = dbConn;