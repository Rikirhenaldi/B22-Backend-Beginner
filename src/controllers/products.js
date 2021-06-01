const productModel = require('../models/products')

const timeHelper = require('../helpers/date')

exports.createProduct = (req, res) => {
  productModel.createProduct(req.body, () => {
    return res.json({
      succsess: true,
      message: 'Products has been created succsessfuly'
    })
  })
}

exports.getProducts = (req, res) => {
  productModel.getProducts((err, results, _fields) => {
    if (!err) {
      return res.status(200).json({
        succsess: true,
        message: 'List of Products',
        results
      })
    }
  })
}

exports.updateProduct = (req, res) => {
  const { id: stringId } = req.params
  const id = parseInt(stringId)
  productModel.getProductById(id, (err, results, _fields) => {
    if (!err) {
      if (results.length > 0) {
        const { name, price } = req.body
        const updateData = { id, name, price, updated_at: timeHelper.date() }
        productModel.updateProduct(updateData, (err, results, _fields) => {
          if (!err) {
            return res.status(200).json({
              succses: true,
              message: 'product updated succsessfuly'
            })
          } else {
            console.log(err)
            return res.status(500).json({
              succsess: false,
              message: 'an error occurred'
            })
          }
        })
      }
    } else {
      return res.status(404).json({
        succsess: false,
        message: 'product not found'
      })
    }
  })
}

// update satu column pada database
exports.updateProductPatching = (req, res) => {
  const { id: stringId } = req.params
  const id = parseInt(stringId)
  productModel.getProductById(id, (err, results, _fields) => {
    if (!err) {
      if (results.length > 0) {
        const key = Object.keys(req.body)
        if (key.length > 1) {
          return res.status(400).json({
            succsess: false,
            message: 'system just need one column'
          })
        } else {
          const firstColumn = key[0]
          const updateData = { id, updated_at: timeHelper.date(), [firstColumn]: req.body[firstColumn] }
          productModel.updateProductPatch(updateData, (err, results, _fields) => {
            if (!err) {
              return res.status(200).json({
                succsess: true,
                message: 'product updated succsessfully'
              })
            } else {
              console.log(err)
              return res.status(500).json({
                succsess: false,
                message: 'ann error occurred'
              })
            }
          })
        }
      } else {
        return res.status(404).json({
          succsess: false,
          message: 'product not found'
        })
      }
    }
  })
}

exports.deleteProduct = (req, res) => {
  const { id: stringId } = req.params
  const id = parseInt(stringId)
  productModel.getProductById(id, (err, results, _fields) => {
    if (!err) {
      if (results.length > 0) {
        productModel.deleteproduct(id, (err, results, _fields) => {
          if (!err) {
            return res.status(200).json({
              succses: true,
              message: 'Product has been Deleted'
            })
          } else {
            console.log(err)
            return res.status(500).json({
              succsess: false,
              message: 'an error occurred'
            })
          }
        })
      }
    } else {
      return res.status(404).json({
        succsess: false,
        message: 'product not found'
      })
    }
  })
}

exports.getDetailProduct = (req, res) => {
  const { id: stringId } = req.params
  const id = parseInt(stringId)
  productModel.getProductById(id, (err, results, _fields) => {
    if (!err) {
      if (results.length === 1) {
        return res.status(200).json({
          succsess: true,
          message: `Detail of Product from id ${id}`,
          results
        })
      } else {
        return res.status(500).json({
          succsess: false,
          message: 'an error occurred'
        })
      }
    } else {
      return res.status(404).json({
        succsess: false,
        message: 'Item Not Found'
      })
    }
  })
}

// search products
exports.searchingProducts = (req, res) => {
  const cond = req.query.search
  if (cond) {
    productModel.searchProduct(cond, (err, results, _fields) => {
      if (err) throw err
      return res.status(200).json({
        succsess: true,
        message: `List of Products from key ${cond}`,
        results
      })
    })
  } else {
    productModel.getProducts((err, results, _fields) => {
      if (!err) {
        return res.status(200).json({
          succsess: true,
          message: 'List of Products',
          results
        })
      }
    })
  }
}

exports.sortingProducts = (req, res) => {
  const col = req.query.col
  const type = req.query.type
  productModel.sortingProduct(col, type, (err, results, _fields) => {
    if (col && type) {
      if (!err) {
        return res.status(200).json({
          success: true,
          message: `sorting product by ${col} with type ${type} succsessfully`,
          results
        })
      } else {
        return res.status(404).json({
          success: false,
          message: 'column not found'
        })
      }
    } else {
      return res.status(500).json({
        success: false,
        message: 'need two keys for sorting'
      })
    }
  })
}

exports.searchingAndSortingProducts = (req, res) => {
  const cond = req.query.search || ''
  const col = req.query.col || 'id'
  const type = req.query.type || 'ASC'
  productModel.searchAndsortProduct(cond, col, type, (err, results, _fields) => {
    if (err) throw err
    return res.status(200).json({
      succsess: true,
      message: `List of Products from key ${cond}`,
      results
    })
  })
}
