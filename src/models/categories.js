const db = require('../helpers/db')
const table = 'categories'

const { promisify } = require('util')
const execPromise = promisify(db.query).bind(db)

exports.createCategory = (data) => {
  return execPromise(`
  INSERT INTO ${table} ( category, created_at)
  VALUES (?, ?)`, [data.category, data.created_at], )
}

exports.getCategory = () => {
  return execPromise(`
  SELECT ${table}.id, ${table}.category FROM ${table}
  `)
}

exports.getCategoryById = (id) => {
  return execPromise(`
  SELECT ${table}.id, ${table}.category FROM ${table}
   WHERE ${table}.id=?
  `, [id])
}

exports.updateCategory = (data) => {
  return execPromise(`
  UPDATE ${table} SET category= ?, updated_at= ?
  WHERE id= ?
  `, [data.category, data.updated_at, data.id])
}

// exports.updateCategoryPatch = (data, ) => {
//   const key = Object.keys(data)
//   const lastColumn = key[key.length - 1]
//   console.log(data[lastColumn])
//   db.query(`
//   UPDATE ${table} SET ${lastColumn} = ?, updated_at = ? WHERE id = ?
//   `, [data[lastColumn], data.updated_at, data.id], )
// }

exports.deleteCategory = (id) => {
  return execPromise(`
  DELETE FROM ${table} WHERE id = ?
  `, [id])
}
