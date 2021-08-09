const variantsModel = require('../models/variants')

const timeHelper = require('../helpers/date')

exports.createVariants = (req, res) => {
  variantsModel.createVariant(req.body, () => {
    return res.json({
      succsess: true,
      message: 'Variant has been created succsessfuly'
    })
  })
}

exports.getVariants = (req, res) => {
  variantsModel.getVariant((err, results, _fields) => {
    if (!err) {
      return res.status(200).json({
        succsess: true,
        message: 'List of Variants',
        results
      })
    }
  })
}

exports.updateVariant = (req, res) => {
  const { id: stringId } = req.params
  const id = parseInt(stringId)
  variantsModel.getVariantById(id, (err, results, _fields) => {
    if (!err) {
      if (results.length > 0) {
        const { variant } = req.body
        const updateData = { id, variant, updated_at: timeHelper.date() }
        variantsModel.updateVariant(updateData, (err, results, _fields) => {
          if (!err) {
            return res.status(200).json({
              succses: true,
              message: 'Variant updated succsessfuly'
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
        message: 'Variant not found'
      })
    }
  })
}

// update satu column pada database
exports.updateVariantPatching = (req, res) => {
  const { id: stringId } = req.params
  const id = parseInt(stringId)
  variantsModel.getVariantById(id, (err, results, _fields) => {
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
          variantsModel.updateVariantPatch(updateData, (err, results, _fields) => {
            if (!err) {
              return res.status(200).json({
                succsess: true,
                message: 'Variant updated succsessfully'
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
          message: 'Variant not found'
        })
      }
    }
  })
}

exports.deleteVariant = (req, res) => {
  const { id: stringId } = req.params
  const id = parseInt(stringId)
  variantsModel.getVariantById(id, (err, results, _fields) => {
    if (!err) {
      if (results.length > 0) {
        variantsModel.deleteVariant(id, (err, results, _fields) => {
          if (!err) {
            return res.status(200).json({
              succses: true,
              message: 'Variant has been Deleted'
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
        message: 'Variant not found'
      })
    }
  })
}

// exports.getDetailProduct = (req, res) => {
//   const { id: stringId } = req.params
//   const id = parseInt(stringId)
//   productModel.getProductById(id, (err, results, _fields) => {
//     if (!err) {
//       if (results.length === 1) {
//         return res.status(200).json({
//           succsess: true,
//           message: `Detail of Product from id ${id}`,
//           results
//         })
//       } else {
//         return res.status(500).json({
//           succsess: false,
//           message: 'an error occurred'
//         })
//       }
//     } else {
//       return res.status(404).json({
//         succsess: false,
//         message: 'Item Not Found'
//       })
//     }
//   })
// }

// exports.getProductByCategory = (req, res) => {
//   const { id: stringId } = req.params
//   const id = parseInt(stringId)
//   productModel.getProductByCategory(id, (err, results, _fields) => {
//     if (!err) {
//       if (results.length > 0) {
//         return res.status(200).json({
//           succsess: true,
//           message: `Detail of Product from id ${id}`,
//           results
//         })
//       } else {
//         return res.status(500).json({
//           succsess: false,
//           message: 'an error occurred'
//         })
//       }
//     } else {
//       return res.status(404).json({
//         succsess: false,
//         message: 'Item Not Found'
//       })
//     }
//   })
// }

// // search products
// exports.searchingProducts = (req, res) => {
//   const cond = req.query.search
//   if (cond) {
//     productModel.searchProduct(cond, (err, results, _fields) => {
//       if (err) throw err
//       return res.status(200).json({
//         succsess: true,
//         message: `List of Products from key ${cond}`,
//         results
//       })
//     })
//   } else {
//     productModel.getProducts((err, results, _fields) => {
//       if (!err) {
//         return res.status(200).json({
//           succsess: true,
//           message: 'List of Products',
//           results
//         })
//       }
//     })
//   }
// }

// exports.sortingProducts = (req, res) => {
//   const col = req.query.col
//   const type = req.query.type
//   productModel.sortingProduct(col, type, (err, results, _fields) => {
//     if (col && type) {
//       if (!err) {
//         return res.status(200).json({
//           success: true,
//           message: `sorting product by ${col} with type ${type} succsessfully`,
//           results
//         })
//       } else {
//         return res.status(404).json({
//           success: false,
//           message: 'column not found or wrong key of type shorting'
//         })
//       }
//     } else {
//       return res.status(500).json({
//         success: false,
//         message: 'need two keys to run system'
//       })
//     }
//   })
// }

// exports.searchingAndSortingProducts = (req, res) => {
//   const cond = req.query.search || ''
//   const col = req.query.col || 'id'
//   const type = req.query.type || 'ASC'
//   productModel.searchAndsortProduct(cond, col, type, (err, results, _fields) => {
//     if (err) throw err
//     return res.status(200).json({
//       succsess: true,
//       message: `List of Products from key ${cond}`,
//       results
//     })
//   })
// }
