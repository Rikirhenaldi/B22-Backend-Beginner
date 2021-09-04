const { response } = require('../helpers/standardResponse')
const { codeTransaction } = require('../helpers/transactions')
const { getProductsById } = require('../models/products')
const { getProfile, updateProfile, updateProfilePatch, changePassword } = require('../models/profile')
const { createTransaction, createProductTransaction, getHistoryTransaction, getDetailHistoryPay } = require('../models/transactions')
const { getUserById } = require('../models/user')
const { APP_TRANSACTION_PREFIX } = process.env
const timeHelper = require('../helpers/date')
const bcrypt = require('bcrypt')

exports.createTransaction = (req, res) => {
  const data = req.body
  if (typeof data.product_id === 'string') {
    data.product_id = [data.product_id]
    data.product_amount = [data.product_amount]
  }
  getProductsById(data.product_id.map(id => parseInt(id)), (err, items) => {
    if (err) {
      console.log(err)
      return response(res, 400, false, 'eror occurred')
    } else {
      const code = codeTransaction(APP_TRANSACTION_PREFIX, 1)
      const total = items.map((products, idx) => products.price * data.product_amount[idx]).reduce((acc, curr) => acc + curr)
      const tax = total * (10 / 100)
      const shippingCost = 10000
      const paymentMethod = data.payment_method
      const idUser = req.authUser.id
      getUserById(idUser, (err, results) => {
        if (err) {
          return response(res, 400, false, 'user not found')
        } else {
          const shippingAddress = results[0].address
          if (!shippingAddress) {
            return response(res, 400, false, 'Address must be provided')
          } else {
            const finalData = {
              code, total, tax, shipping_cost: shippingCost, payment_method: paymentMethod, shipping_address: shippingAddress, id_user: idUser
            }
            createTransaction(finalData, (err, results) => {
              if (err) {
                return response(res, 400, false, 'an errors occurred')
              } else {
                items.forEach((item, idx) => {
                  console.log(items)
                  const finalData = {
                    name: item.name,
                    price: item.price,
                    amount: data.product_amount[idx],
                    id_products: item.id,
                    id_transaction: results.insertId
                  }
                  createProductTransaction(finalData, (err) => {
                    if (err) {
                      return response(res, 400, false, 'payment failed')
                    } else {
                      console.log(`products ${item.id} inserted into product_transactions`)
                      // return response(res, 200, true, 'payment succesfully', finalData)
                    }
                  })
                })
              }
              return response(res, 200, true, 'payment succesfully', items)
            })
          }
        }
      })
    }
  })
}

exports.getProfile = (req, res) => {
  getProfile(req.authUser.id, (err, results) => {
    if (err) {
      return response(res, 401, false, "you don't have permission to accsess this resorce")
    } else {
      const users = results[0]
      if (users.img !== null && !users.img.startsWith('http')) {
        users.img = `${process.env.APP_URL}${users.img}`
      }
      return response(res, 200, true, 'Your Profile', results)
    }
  })
}

const userPicture = require('../helpers/upload').single('img')

exports.updateUserProfile = (req, res) => {
  getUserById(req.authUser.id, (err, results, _fields) => {
    if (!err) {
      if (results.length > 0) {
        userPicture(req, res, err => {
          if (err) throw err
          req.body.img = req.file ? `${process.env.APP_UPLOADS_ROUTE}/${req.file.filename}` : null
          const { img, address, name, email, phoneNumber } = req.body
          const updateData = { id: req.authUser.id, img, address, name, email, phoneNumber, updated_at: timeHelper.date() }
          updateProfile(updateData, (err, results, _fields) => {
            if (err) {
              console.log(err)
              return response(res, 500, false, 'an Error accurred')
            } else {
              console.log(updateData)
              if (updateData.img !== null && !updateData.img.startsWith('http')) {
                updateData.img = `${process.env.APP_URL}${updateData.img}`
              }
              return response(res, 200, true, 'Profile Updated Sucsessfully', updateData)
            }
          })
        })
      } else {
        return response(res, 402, false, 'You dont have permission to accsess this resource')
      }
    }else{
      console.log(err);
      return response(res, 402, false, 'eror on query')
    }
  })
}

exports.UpdateUserProfilePatch = (req, res) => {
  const id = req.authUser.id
  getUserById(id, (err, results, _fields) => {
    if (!err) {
      if (results.length > 0) {
        userPicture(req, res, err => {
          if (err) throw err
          req.body.img = req.file ? `${process.env.APP_UPLOADS_ROUTE}/${req.file.filename}` : null
          const key = Object.keys(req.body)
          const firstColumn = key[0]
          const updateData = { id, updated_at: timeHelper.date(), [firstColumn]: req.body[firstColumn] }
          if (err) {
            return response(res, 402, false, 'You dont have permission to accsess this resource')
          } else {
            if (results.length > 0) {
              if (key.length > 1) {
                return response(res, 400, false, "System can't update more than one column")
              } else {
                updateProfilePatch(updateData, (err, results, _fields) => {
                  if (err) {
                    return response(res, 500, false, 'ann error occurred')
                  } else {
                    return response(res, 200, true, 'Profile Updated Partially Sucsessfully', results)
                  }
                })
              }
            }
          }
        })
      }
    }
  })
}

exports.changeUserPassword = (req, res) => {
  const id = req.authUser.id
  getUserById(id, async (err, results, _fields) => {
    if (err) {
      return response(res, 402, false, 'You dont have permission to accsess this resource, please login first !')
    } else {
      const data = req.body
      const newPassword = data.password = await bcrypt.hash(data.password, await bcrypt.genSalt())
      const updateData = { id, updated_at: timeHelper.date(), password: newPassword }
      changePassword(updateData, (err, results, _fields) => {
        if (err) {
          return response(res, 500, false, 'an error occured')
        } else {
          return response(res, 200, true, 'Password change succsessfully', results)
        }
      })
    }
  })
}

exports.userTransactionHistory = (req, res) => {
  getHistoryTransaction(req.authUser.id, (err, results, _fields) => {
    if (!err) {
      return response(res, 200, true, 'list of your transactions', results)
    } else {
      console.log(err)
      return response(res, 402, false, 'You dont have permission to accsess this resource, please login first !', results)
    }
  })
}

exports.userDetailHistoryPayment = (req, res) => {
  const { id: stringId } = req.params
  const id = parseInt(stringId)
  getDetailHistoryPay(id, (err, results, _fields) => {
    if (!err) {
      return response(res, 200, true, 'list of your detail transactions', results)
    } else {
      console.log(err)
      return response(res, 402, false, 'You dont have permission to accsess this resource, please login first !', results)
    }
  })
}
