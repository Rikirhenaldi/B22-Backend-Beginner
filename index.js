require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))

const productRouter = require('./src/routes/products')
app.use('/products', productRouter)

app.get('/', (req, res) => {
  const data = {
    succsess: true,
    message: 'Backend is running well'
  }
  return res.json(data)
})

app.listen(8080, () => {
  console.log('App runing on port 8080')
})

// SELECT items.id, items.name, categories.id as category_id, categories.name as category_name FROM items LEFT JOIN item_categories ON item_categories.item_id = items.id LEFT JOIN categories ON item_categories.category_id = categories.id WHERE categories.id = 1
