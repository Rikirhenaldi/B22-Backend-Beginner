const route = require('express').Router()

const categoriesController = require('../controllers/categories')

// route.get('/category/:id', productController.getProductByCategory)
// route.get('/searchAndSort', productController.searchingAndSortingProducts)
// route.get('/sort', productController.sortingProducts)
route.post('/', categoriesController.createCategories)
route.get('/', categoriesController.getCategories)
route.put('/:id', categoriesController.updateCategory)
route.delete('/:id', categoriesController.deleteCategory)
// route.get('/:id', productController.getDetailProduct)
// route.get('/', productController.searchingProducts)
module.exports = route
