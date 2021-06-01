const db = require('../helpers/db')

exports.createProduct = (data, cb) => {
  db.query(`
  INSERT INTO products ( name, price, category_id, variant_id, description, img_link, delivery_id, created_at)
  VALUES ('${data.name}', ${data.price}, ${data.category_id}, ${data.variant_id}, '${data.description}', '${data.img_link}', ${data.delivery_id}, '${data.created_at}')`, cb)
}

exports.getProducts = (cb) => {
  db.query(`
  SELECT products.id, products.name, products.price, categories.category as category_name,variants.variant as variant_name, products.description, products.img_link, deliveries.delivery as delivery FROM products
  LEFT JOIN product_categories ON product_categories.product_id = products.id
  LEFT JOIN categories ON product_categories.category_id = categories.id
  LEFT JOIN product_variants ON product_variants.product_id = products.id
  LEFT JOIN variants ON product_variants.variants_id = variants.id
  LEFT JOIN product_deliveries ON product_deliveries.product_id = products.id
  LEFT JOIN deliveries ON product_deliveries.delivery_id = deliveries.id
  `, cb)
}

exports.getProductById = (id, cb) => {
  db.query(`
  SELECT products.id, products.name, products.price, categories.category as category_name,variants.variant as variant_name, products.description, products.img_link, deliveries.delivery as delivery FROM products
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
  console.log(data[lastColumn])
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
  SELECT products.id, products.name, products.price, categories.category as category_name,variants.variant as variant_name, products.description, products.img_link, deliveries.delivery as delivery FROM products
  LEFT JOIN product_categories ON product_categories.product_id = products.id
  LEFT JOIN categories ON product_categories.category_id = categories.id
  LEFT JOIN variants ON products.variant_id = variants.id
  LEFT JOIN deliveries ON products.delivery_id = deliveries.id
  WHERE products.name LIKE '%${cond}%' 
  `, cb)
}

exports.sortingProduct = (col, type, cb) => {
  db.query(`
  SELECT products.id, products.name, products.price, categories.category as category_name,variants.variant as variant_name, products.description, products.img_link, deliveries.delivery as delivery FROM products
  LEFT JOIN categories ON products.category_id = categories.id
  LEFT JOIN variants ON products.variant_id = variants.id
  LEFT JOIN deliveries ON products.delivery_id = deliveries.id
  ORDER BY products.${col} ${type} 
  `, cb)
}

exports.searchAndsortProduct = (cond, col, type, cb) => {
  db.query(`
  SELECT products.id, products.name, products.price, categories.category as category_name,variants.variant as variant_name, products.description, products.img_link, deliveries.delivery as delivery FROM products
  LEFT JOIN categories ON products.category_id = categories.id
  LEFT JOIN variants ON products.variant_id = variants.id
  LEFT JOIN deliveries ON products.delivery_id = deliveries.id
  WHERE products.name LIKE '%${cond}%' 
  ORDER BY products.${col} ${type} 
  `, cb)
}
