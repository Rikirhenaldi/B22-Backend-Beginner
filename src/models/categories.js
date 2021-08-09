const db = require('../helpers/db')
const table = 'categories'
exports.createCategory = (data, cb) => {
  db.query(`
  INSERT INTO ${table} ( category, created_at)
  VALUES (?, ?)`, [data.category, data.created_at], cb)
}

exports.getCategory = (cb) => {
  db.query(`
  SELECT ${table}.id, ${table}.category FROM ${table}
  `, cb)
}

exports.getCategoryById = (id, cb) => {
  db.query(`
  SELECT ${table}.id, ${table}.category FROM ${table}
   WHERE ${table}.id=?
  `, [id], cb)
}

exports.updateCategory = (data, cb) => {
  db.query(`
  UPDATE ${table} SET category= ?, updated_at= ?
  WHERE id= ?
  `, [data.category, data.updated_at, data.id], cb)
}

exports.updateCategoryPatch = (data, cb) => {
  const key = Object.keys(data)
  const lastColumn = key[key.length - 1]
  console.log(data[lastColumn])
  db.query(`
  UPDATE ${table} SET ${lastColumn} = ?, updated_at = ? WHERE id = ?
  `, [data[lastColumn], data.updated_at, data.id], cb)
}

exports.deleteCategory = (id, cb) => {
  db.query(`
  DELETE FROM ${table} WHERE id = ?
  `, [id], cb)
}
