const route = require('express').Router()

const variantsController = require('../controllers/variant')

// route.get('/category/:id', productController.getProductByCategory)
// route.get('/searchAndSort', productController.searchingAndSortingProducts)
// route.get('/sort', productController.sortingProducts)
route.post('/', variantsController.createVariants)
route.get('/', variantsController.getVariants)
route.put('/:id', variantsController.updateVariant)
route.patch('/:id', variantsController.updateVariantPatching)
route.delete('/:id', variantsController.deleteVariant)
// route.get('/:id', productController.getDetailProduct)
// route.get('/', productController.searchingProducts)
module.exports = route
