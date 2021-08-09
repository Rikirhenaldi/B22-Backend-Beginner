const db = require('../helpers/db')

exports.createProduct = (data, cb) => {
  db.query(`
  INSERT INTO products ( name, price, category_id, variant_id, quantity, description, img_link, delivery_id, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [data.name, data.price, data.category_id, data.variant_id, data.quantity, data.description, data.img_link, data.delivery_id, data.created_at], cb)
}

exports.getProducts = (cb) => {
  db.query(`
  SELECT products.id, products.name, products.price, categories.category as category_name,variants.variant as variant_name, products.quantity, products.description, products.img_link, deliveries.delivery as delivery FROM products
  LEFT JOIN categories ON products.category_id = categories.id
  LEFT JOIN variants ON products.variant_id = variants.id
  LEFT JOIN deliveries ON products.delivery_id = deliveries.id
  `, cb)
}

exports.getProductById = (id, cb) => {
  db.query(`
  SELECT products.id, products.name, products.price, categories.category as category_name,variants.variant as variant_name, products.quantity, products.description, products.img_link, deliveries.delivery as delivery FROM products
  LEFT JOIN categories ON products.category_id = categories.id
  LEFT JOIN variants ON products.variant_id = variants.id
  LEFT JOIN deliveries ON products.delivery_id = deliveries.id
   WHERE products.id=?
  `, [id], cb)
}

exports.updateProduct = (data, cb) => {
  db.query(`
  UPDATE products SET name= ?, price= ?, updated_at= ? 
  WHERE id= ?
  `, [data.name, data.price, data.updated_at, data.id], cb)
}

exports.updateProductPatch = (data, cb) => {
  const key = Object.keys(data)
  const lastColumn = key[key.length - 1]
  db.query(`
  UPDATE products SET ${lastColumn} = ?, updated_at = ? WHERE id = ?
  `, [data[lastColumn], data.updated_at, data.id], cb)
}

exports.deleteproduct = (id, cb) => {
  db.query(`
  DELETE FROM products WHERE id = ?
  `, [id], cb)
}

exports.searchProduct = (cond, cb) => {
  db.query(`
  SELECT products.id, products.name, products.price, categories.category as category_name,variants.variant as variant_name, products.quantity, products.description, products.img_link, deliveries.delivery as delivery FROM products
  LEFT JOIN product_categories ON product_categories.product_id = products.id
  LEFT JOIN categories ON product_categories.category_id = categories.id
  LEFT JOIN variants ON products.variant_id = variants.id
  LEFT JOIN deliveries ON products.delivery_id = deliveries.id
  WHERE products.name LIKE '%${cond}%' 
  `, cb)
}

exports.sortingProduct = (col, type, cb) => {
  db.query(`
  SELECT products.id, products.name, products.price, categories.category as category_name,variants.variant as variant_name, products.quantity, products.description, products.img_link, deliveries.delivery as delivery FROM products
  LEFT JOIN categories ON products.category_id = categories.id
  LEFT JOIN variants ON products.variant_id = variants.id
  LEFT JOIN deliveries ON products.delivery_id = deliveries.id
  ORDER BY products.${col} ${type} 
  `, cb)
}

exports.searchAndsortProduct = (cond, limit, offset, page, col, type, cb) => {
  db.query(`
  SELECT products.id, products.name, products.price, categories.category as category_name,variants.variant as variant_name, products.quantity, products.description, products.img_link, deliveries.delivery as delivery FROM products
  LEFT JOIN categories ON products.category_id = categories.id
  LEFT JOIN variants ON products.variant_id = variants.id
  LEFT JOIN deliveries ON products.delivery_id = deliveries.id
  WHERE products.name LIKE '%${cond}%' 
  ORDER BY products.${col} ${type} 
  LIMIT ? OFFSET ?
  `, [limit, offset], cb)
}

exports.getProductByCategory = (id, limit, offset, page, col, type, cb) => {
  db.query(`
  SELECT products.id, products.name, products.price, products.img_link FROM products
  LEFT JOIN product_categories ON product_categories.product_id = products.id
   WHERE product_categories.category_id=?
   ORDER BY products.${col} ${type} 
   LIMIT ? OFFSET ?
  `, [id, limit, offset], cb)
}

exports.getProductsCount = (cond, cb) => {
  db.query(`
    SELECT COUNT (products.id) as count FROM products
    WHERE products.name LIKE '%${cond}%'`
  , cb)
}

exports.getProductsCount2 = (id, cb) => {
  db.query(`
    SELECT COUNT (products.id) as count FROM products
    LEFT JOIN product_categories ON product_categories.product_id = products.id
    WHERE product_categories.category_id=?`
  , [id], cb)
}

exports.getProductsById = (id, cb) => {
  db.query(`
  SELECT id, name, price, quantity FROM products WHERE id IN (?)
  `, [id], cb)
}
