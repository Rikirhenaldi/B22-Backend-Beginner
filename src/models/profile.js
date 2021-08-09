const connection = require('../helpers/db')
const table = 'users'

exports.getProfile = (id, cb) => {
  connection.query(`
  SELECT id, img,address, role, name, email, phoneNumber FROM ${table} WHERE id=?
  `, [id], cb)
}

exports.updateProfile = (data, cb) => {
  connection.query(`
  UPDATE ${table} SET img=?, address=?, phoneNumber=?, name=?, email=?, updated_at=? 
  WHERE id=?
  `, [data.img, data.address, data.phoneNumber, data.name, data.email, data.updated_at, data.id], cb)
}

exports.updateProfilePatch = (data, cb) => {
  const key = Object.keys(data)
  const lastColumn = key[key.length - 1]
  console.log(data[lastColumn])
  connection.query(`
  UPDATE users SET ${lastColumn} = ?, updated_at = ? WHERE id = ?
  `, [data[lastColumn], data.updated_at, data.id], cb)
}

exports.changePassword = (data, cb) => {
  connection.query(`
  UPDATE ${table} SET password=?, updated_at=? 
  WHERE id=?
  `, [data.password, data.updated_at, data.id], cb)
}
