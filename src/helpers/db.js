const mysql = require('mysql2')
const { DB_HOST, DB_NAME, DB_USER, DB_PASS } = process.env
const options = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME
}

const connection = mysql.createConnection(options)

connection.connect((error) => {
  if (error) {
    return console.log('ini eror kenapa', error)
  }
  console.log('You are now conected ...')
})

module.exports = connection
