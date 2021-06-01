const route = require('express').Router()

const productController = require('../controllers/products')

route.get('/searchAndSort', productController.searchingAndSortingProducts)
route.get('/sort', productController.sortingProducts)
route.post('/', productController.createProduct)
route.get('/list', productController.getProducts)
route.put('/:id', productController.updateProduct)
route.patch('/:id', productController.updateProductPatching)
route.delete('/:id', productController.deleteProduct)
route.get('/:id', productController.getDetailProduct)
route.get('/', productController.searchingProducts)
module.exports = route
