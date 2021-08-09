const { createTransaction, getProfile, updateUserProfile, UpdateUserProfilePatch, changeUserPassword, userTransactionHistory, userDetailHistoryPayment } = require('../controllers/transactions')

const route = require('express').Router()

route.post('/transactions', createTransaction)
route.put('/profile/change_password', changeUserPassword)
route.get('/profile/history_transactions/:id', userDetailHistoryPayment)
route.get('/profile/history_transactions', userTransactionHistory)
route.get('/profile', getProfile)
route.put('/profile', updateUserProfile)
route.patch('/profile', UpdateUserProfilePatch)

module.exports = route
