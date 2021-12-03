const { response } = require('../helpers/standardResponse')
const userModel = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { APP_KEY } = process.env

exports.register = async (req, res) => {
  const data = req.body
  if (data.password.length < 6) {
    return response(res, 400, false, 'password must be greater than 6')
  } else {
    data.password = await bcrypt.hash(data.password, await bcrypt.genSalt())
    if (data.phoneNumber.length < 10) {
      return response(res, 400, false, 'input format number is wrong, digit number must be greater than 10')
    } else {
      const results = await userModel.createUserPromise(data)
      if (results.affectedRows) {
        return response(res, 200, true, 'Register Succsessfully')
      } else {
        return response(res, 400, false, 'register failed')
      }
    }
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body
  const results = await userModel.getUserByEmailPromise(email)
  if (results.length < 1) return response(res, 401, false, 'wrong email or password!')
  const user = results[0]
  const compare = await bcrypt.compare(password, user.password)
  if (compare) {
    const payload = { id: user.id, email: user.email }
    const token = jwt.sign(payload, APP_KEY)
    return response(res, 200, true, 'Login SuccessFully', { token })
  } else {
    return response(res, 401, false, 'Wrong email or password!')
  }
}
