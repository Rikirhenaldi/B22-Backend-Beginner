const mysql = require('mysql2')
const { DB_HOST, DB_NAME, DB_USER, DB_PASS, PORT } = process.env
const options = {
  host: DB_HOST,
  port: PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASS
}

const connection = mysql.createConnection(options)

connection.connect()

module.exports = connection
