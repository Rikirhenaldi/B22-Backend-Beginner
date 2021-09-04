const db = require('../helpers/db')
const table = 'variants'

const { promisify } = require('util')
const execPromise = promisify(db.query).bind(db)

exports.createVariant = (data) => {
  return execPromise(`
  INSERT INTO ${table} ( variant, created_at)
  VALUES (?, ?)`, [data.variant, data.created_at])
}

exports.getVariant = (cond) => {
  return execPromise(`
  SELECT ${table}.id, ${table}.variant FROM ${table}
  WHERE ${table}.variant LIKE '%${cond}%'
  `)
}

exports.getVariantById = (id) => {
  return execPromise(`
  SELECT ${table}.id, ${table}.variant FROM ${table}
   WHERE ${table}.id=?
  `, [id])
}

exports.updateVariant = (data) => {
  return execPromise(`
  UPDATE ${table} SET variant= ?, updated_at= ?
  WHERE id= ?
  `, [data.variant, data.updated_at, data.id])
}

// exports.updateVariantPatch = (data) => {
//   const key = Object.keys(data)
//   const lastColumn = key[key.length - 1]
//   console.log(data[lastColumn])
//   return execPromise(`
//   UPDATE ${table} SET ${lastColumn} = ?, updated_at = ? WHERE id = ?
//   `, [data[lastColumn], data.updated_at, data.id])
// }

exports.deleteVariant = (id) => {
  return execPromise(`
  DELETE FROM ${table} WHERE id = ?
  `, [id])
}
