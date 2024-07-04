// Allows application to connect to the sql db
const mysql = require("mysql2");
// Allows the use of enviromental variables to conceal server information when uploaded to github
require('dotenv').config();

// Store the connection to mysql in a variable to export
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect(function (err) {
  if (err) throw err;
});

module.exports = connection;