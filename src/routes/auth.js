const userController = require('../controllers/auth')

const route = require('express').Router()

route.post('/register', userController.register)
route.post('/login', userController.login)

module.exports = route
