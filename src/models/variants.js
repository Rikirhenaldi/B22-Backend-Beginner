const db = require('../helpers/db')
const table = 'variants'
exports.createVariant = (data, cb) => {
  db.query(`
  INSERT INTO ${table} ( variant, created_at)
  VALUES (?, ?)`, [data.variant, data.created_at], cb)
}

exports.getVariant = (cb) => {
  db.query(`
  SELECT ${table}.id, ${table}.variant FROM ${table}
  `, cb)
}

exports.getVariantById = (id, cb) => {
  db.query(`
  SELECT ${table}.id, ${table}.variant FROM ${table}
   WHERE ${table}.id=?
  `, [id], cb)
}

exports.updateVariant = (data, cb) => {
  db.query(`
  UPDATE ${table} SET variant= ?, updated_at= ?
  WHERE id= ?
  `, [data.variant, data.updated_at, data.id], cb)
}

exports.updateVariantPatch = (data, cb) => {
  const key = Object.keys(data)
  const lastColumn = key[key.length - 1]
  console.log(data[lastColumn])
  db.query(`
  UPDATE ${table} SET ${lastColumn} = ?, updated_at = ? WHERE id = ?
  `, [data[lastColumn], data.updated_at, data.id], cb)
}

exports.deleteVariant = (id, cb) => {
  db.query(`
  DELETE FROM ${table} WHERE id = ?
  `, [id], cb)
}
