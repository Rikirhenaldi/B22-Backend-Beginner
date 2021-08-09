const productModel = require('../models/products')

const timeHelper = require('../helpers/date')
const { response } = require('../helpers/standardResponse')
const { getUserRole } = require('../models/user')
const { APP_URL } = process.env

const itemPicture = require('../helpers/upload').single('img_link')

exports.createProduct = (req, res) => {
  getUserRole(req.authUser.id, (err, results) => {
    if (err) response(res, 401, false, 'internal server error')
    if (results[0].role === 'Admin') {
      itemPicture(req, res, err => {
        if (err) throw err
        req.body.img_link = `${process.env.APP_UPLOADS_ROUTE}/${req.file.filename}`
        productModel.createProduct(req.body, (err, results) => {
          if (err) throw err
          if (results.affectedRows) {
            response(res, 200, true, 'Products created succsessfully')
          } else {
            response(res, 401, false, 'Failed to created products')
          }
        })
      })
    } else {
      return response(res, 401, false, 'You dont have permission to accses this resource')
    }
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
    }else{
      console.log(err);
      return res.status(500).json({
        succsess: false,
        message: 'an error occured',
      })
    }
  })
}

exports.updateProduct = (req, res) => {
  const { id: stringId } = req.params
  const id = parseInt(stringId)
  getUserRole(req.authUser.id, (err, results) => {
    if (err) {
      return response(res, 500, false, 'an error occurred')
    } else {
      if (results[0].role === 'Admin') {
        // const id = req.authUser.id
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
      } else {
        return response(res, 402, false, 'You dont have permission to accses this resource')
      }
    }
  })
}

// update satu column pada database
exports.updateProductPatching = (req, res) => {
  const { id: stringId } = req.params
  const id = parseInt(stringId)
  getUserRole(req.authUser.id, (err, results) => {
    if (err) {
      return response(res, 500, false, 'an error occurred')
    } else {
      if (results[0].role === 'Admin') {
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
      } else {
        return response(res, 402, false, 'You dont have permission to accses this resource')
      }
    }
  })
}

// delete
exports.deleteProduct = (req, res) => {
  const { id: stringId } = req.params
  const id = parseInt(stringId)
  getUserRole(req.authUser.id, (err, results) => {
    if (err) {
      return response(res, 500, false, 'an error occurred')
    } else {
      if (results[0].role === 'Admin') {
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
      } else {
        return response(res, 402, false, 'You dont have permission to accses this resource')
      }
    }
  })
}

exports.getDetailProduct = (req, res) => {
  const { id: stringId } = req.params
  const id = parseInt(stringId)
  const order = {}
  productModel.getProductById(id, (err, results, _fields) => {
    if (!err) {
      if (results.length === 1) {
        const products = results[0]
        if (products.img_link !== null && !products.img_link.startsWith('http')) {
          products.img_link = `${process.env.APP_URL}${products.img_link}`
        }
        order.idProduct = results[0].id
        order.amount = 1
        order.variant = [1]
        return res.status(200).json({
          succsess: true,
          message: `Detail of Product from id ${id}`,
          results: products,
          order
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
          message: 'column not found or wrong key of type shorting'
        })
      }
    } else {
      return res.status(500).json({
        success: false,
        message: 'need two keys to run system'
      })
    }
  })
}

exports.searchingAndSortingProducts = (req, res) => {
  const cond = req.query.search || ''
  const limit = parseInt(req.query.limit) || 12
  let offset = parseInt(req.query.offset) || 0
  const page = parseInt(req.query.page) || 1
  offset = (page * limit) - limit
  const col = req.query.col || 'id'
  const type = req.query.type || 'ASC'
  const pageInfo = {}
  productModel.searchAndsortProduct(cond, limit, offset, page, col, type, (err, results, _fields) => {
    if (err) return console.log(err) && response(res, 500, false, 'Internal server errors')
    productModel.getProductsCount(cond, (err, resultCount, _fields) => {
      if (err) throw err
      const totalData = resultCount[0].count
      const totalPage = Math.ceil(totalData / limit)
      pageInfo.totalData = totalData
      pageInfo.currentPage = page
      pageInfo.totalPage = totalPage
      pageInfo.limitData = limit
      pageInfo.nextPage = page < totalPage ? `${APP_URL}/products?search=${cond}&col=${col}&page=${page + 1}` : null
      pageInfo.prevPage = page > 1 ? `${APP_URL}/products?search=${cond}&col=${col}&page=${page - 1}` : null
      const finalResults = results
      finalResults.map((products) => {
        if (products.img_link !== null && !products.img_link.startsWith('http')) {
          products.img_link = `${process.env.APP_URL}${products.img_link}`
        }
      })
      return response(res, 200, true, 'List of products', finalResults, pageInfo)
    })
  })
}

exports.getProductByCategory = (req, res) => {
  const { id: stringId } = req.params
  const id = parseInt(stringId)
  const limit = parseInt(req.query.limit) || 8
  let offset = parseInt(req.query.offset) || 0
  const page = parseInt(req.query.page) || 1
  offset = (page * limit) - limit
  const col = req.query.col || 'id'
  const type = req.query.type || 'ASC'
  const pageInfo = {}
  productModel.getProductByCategory(id, limit, offset, page, col, type, (err, results, _fields) => {
    if (!err) {
      if (results.length > 0) {
        productModel.getProductsCount2(id, (err, resultCount, _fields) => {
          if (err) {
            return response(res, 404, false, 'Not found more products')
          } else {
            const totalData = resultCount[0].count
            const totalPage = Math.ceil(totalData / limit)
            pageInfo.totalData = totalData
            pageInfo.currentPage = page
            pageInfo.totalPage = totalPage
            pageInfo.limitData = limit
            pageInfo.homePage = `${APP_URL}/products/category/${id}?page=${page}`
            pageInfo.nextPage = page < totalPage ? `${APP_URL}/products/category/${id}?page=${page + 1}` : null
            pageInfo.prevPage = page > 1 ? `${APP_URL}/products/category/${id}?page=${page - 1}` : null
            const finalResults = results
            finalResults.map((products) => {
              if (products.img_link !== null && !products.img_link.startsWith('http')) {
                products.img_link = `${process.env.APP_URL}${products.img_link}`
              }
            })
            return response(res, 200, true, 'List of products', finalResults, pageInfo)
          }
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
