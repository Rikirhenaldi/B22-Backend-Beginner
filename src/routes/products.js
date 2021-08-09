const route = require('express').Router()

const productController = require('../controllers/products')
const auth = require('../middlewares/auth')

route.get('/category/:id', productController.getProductByCategory)
route.get('/searching', productController.searchingProducts)
route.get('/sort', productController.sortingProducts)
route.post('/', auth, productController.createProduct)
route.get('/list', productController.getProducts)
route.put('/:id', auth, productController.updateProduct)
route.patch('/:id', auth, productController.updateProductPatching)
route.delete('/:id', auth, productController.deleteProduct)
route.get('/:id', productController.getDetailProduct)
route.get('/', productController.searchingAndSortingProducts)
module.exports = route
