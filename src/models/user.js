const connection = require('../helpers/db')

const table = 'users'

const { promisify } = require('util')

const execPromise = promisify(connection.query).bind(connection)

exports.createUser = (data, cb) => {
  connection.query(`
   INSERT INTO ${table} (name, email, password, phoneNumber) VALUES (?,?,?,?)
  `, [data.name, data.email, data.password, data.phoneNumber], cb)
}

exports.createUserPromise = (data) => {
  return execPromise(`
   INSERT INTO ${table} (name, email, password, phoneNumber) VALUES (?,?,?,?)
  `, [data.name, data.email, data.password, data.phoneNumber])
}

exports.getUserByEmail = (email, cb) => {
  connection.query(`
  SELECT id, email, password FROM ${table}
  WHERE email=?
  `, [email], cb)
}

exports.getUserByEmailPromise = (email) => {
  return execPromise(`
  SELECT ${table}.id, ${table}.email, ${table}.password FROM ${table}
  WHERE ${table}.email=?
  `, [email])
}

exports.getUserById = (id, cb) => {
  connection.query(`
  SELECT id, img, address, name, email FROM ${table}
  WHERE id=?
  `, [id], cb)
}

exports.getUserRole = (id, cb) => {
  connection.query(`
  SELECT role FROM ${table}
  WHERE id=?
  `, [id], cb)
}

exports.getUserRoleAsync = (id) => {
  return execPromise(`
  SELECT role FROM ${table}
  WHERE id=?
  `, [id])
}
