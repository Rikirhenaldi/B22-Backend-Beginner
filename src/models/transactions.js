const connection = require('../helpers/db')
const table = 'transactions'

exports.createTransaction = (data, cb) => {
  connection.query(`
  INSERT INTO ${table} (code, total, tax, shipping_cost, shipping_address, payment_method, id_user)
  VALUES(?,?,?,?,?,?,?)
  `, [data.code, data.total, data.tax, data.shipping_cost, data.shipping_address, data.payment_method, data.id_user], cb)
}

exports.createProductTransaction = (data, cb) => {
  connection.query(`
  INSERT INTO product_${table} (name, price, variants, amount, id_products, id_transaction)
  VALUES(?,?,?,?,?,?)
  `, [data.name, data.price, data.variants, data.amount, data.id_products, data.id_transaction], cb)
}

// exports.getHistoryTransaction = (id, cb) => {
//   connection.query(`
//   SELECT users.id, users.address, ${table}.id as id_transaction, product_transactions.name as name_product, product_transactions.price as price_product
//   FROM users
//   LEFT JOIN ${table} ON users.id = ${table}.id_user
//   LEFT JOIN product_transactions ON ${table}.id = product_transactions.id_transaction
//   WHERE users.id=?
//   `, [id], cb)
// }

exports.getHistoryTransaction = (id, cb) => {
  connection.query(`
  SELECT transactions.id as id_payment, transactions.code, transactions.total, transactions.shipping_address,transactions.id_user
  FROM ${table}
  WHERE ${table}.id_user=?
  `, [id], cb)
}

exports.getDetailHistoryPay = (id, cb) => {
  connection.query(`
  SELECT ${table}.id as id_transaction, product_transactions.name as name_product, product_transactions.price as price_product,product_transactions.amount as amount ,products.img_link as img
  FROM ${table}
  LEFT JOIN product_transactions ON ${table}.id = product_transactions.id_transaction
  LEFT JOIN products ON product_transactions.id_products = products.id
  WHERE ${table}.id=?
  `, [id], cb)
}
