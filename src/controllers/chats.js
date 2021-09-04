const chatModels = require('../models/chats')
const { response } = require('../helpers/standardResponse')
const socket = require('../middlewares/socket')
const { APP_URL } = process.env

exports.createMessage = (req, res) => {
  const data = req.body
  chatModels.createMessage(data, (err, results) => {
    if (err) {
      console.log(err)
      return response(res, 401, false, 'Failed to send message')
    } else {
      return response(res, 200, true, 'message sended successfully')
    }
  })
}

exports.sendMessage = (req, res) => {
  const data = req.body
  chatModels.getUserSenderById(req.authUser.id, (err, results) => {
    if (err) {
      console.log(err)
      return response(res, 401, false, 'You must be login first')
    } else {
      const user = results[0]
      const updateData = { isLatest: 0, sender: user.phoneNumber, recipient: data.recipient, sender: data.recipient, recipient: user.phoneNumber }
      console.log(updateData)
      chatModels.updateIsLatest(updateData, (err, results) => {
        if (err) {
          console.log(err)
          return response(res, 401, false, 'an error occurred')
        } else {
          const sendingData = { message: data.message, sender: user.phoneNumber, recipient: data.recipient }
          chatModels.createMessage(sendingData, (err, results) => {
            if (err) {
              console.log(err)
              return response(res, 401, false, 'Failed to send message')
            } else {
              req.socket.emit(sendingData.recipient, {
                message: sendingData.message,
                sender: sendingData.sender
              })
              return response(res, 200, true, 'message sended successfully', sendingData)
            }
          })
        }
      })
    }
  })
}

exports.getChatingList = (req, res) => {
  chatModels.getUserSenderById(req.authUser.id, (err, results) => {
    if (err) {
      console.log(err)
      return response(res, 401, false, 'You must be login first')
    } else {
      const user = { sender: results[0].phoneNumber, recipient: results[0].phoneNumber }
      chatModels.chatingList(user, (err, results) => {
        if (err) {
          console.log(err)
          return response(res, 401, false, 'an erorr occurred')
        } else {
          const user = results
          user.map(data => {
            if (data.senderImg !== null && !data.senderImg.startsWith('http')) {
              data.senderImg = `${process.env.APP_URL}${data.senderImg}`
            }
            if (data.recipientImg !== null && !data.recipientImg.startsWith('http')) {
              data.recipientImg = `${process.env.APP_URL}${data.recipientImg}`
            }
          })
          response(res, 200, true, 'List of chatting', user)
        }
      })
    }
  })
}

exports.chatRoom = (req, res) => {
  const data = req.query
  chatModels.getUserSenderById(req.authUser.id, (err, results) => {
    if (err) {
      response(res, 401, false, 'an error occured')
    } else {
      const user = results[0]
      const userData = { sender: user.phoneNumber, recipient: data.recipient, sender2: user.phoneNumber, recipient2: data.recipient }
      chatModels.getMessage(userData, (err, results) => {
        if (err) {
          console.log(err)
          response(res, 401, false, 'an error occured on geting message')
        } else {
          if (results.length >= 1) {
            const user = results
            user.map(data => {
              if (data.senderImg !== null && !data.senderImg.startsWith('http')) {
                data.senderImg = `${process.env.APP_URL}${data.senderImg}`
              }
              if (data.recipientImg !== null && !data.recipientImg.startsWith('http')) {
                data.recipientImg = `${process.env.APP_URL}${data.recipientImg}`
              }
            })
            response(res, 200, true, `Your chat with user ${data.recipient}`, user)
          } else {
            console.log('ini eror', err)
            response(res, 401, false, `Your dont have chat conversation with user ${data.recipient}`)
          }
        }
      })
    }
  })
}

exports.chatRoomMobile = (req, res) => {
  const data = req.query
  chatModels.getUserSenderById(req.authUser.id, (err, results) => {
    if (err) {
      response(res, 401, false, 'an error occured')
    } else {
      const user = results[0]
      const userData = { sender: user.phoneNumber, recipient: data.recipient, sender2: user.phoneNumber, recipient2: data.recipient }
      chatModels.getMessageMobile(userData, (err, results) => {
        if (err) {
          console.log(err)
          response(res, 401, false, 'an error occured on geting message')
        } else {
          if (results.length >= 1) {
            const user = results
            user.map(data => {
              if (data.senderImg !== null && !data.senderImg.startsWith('http')) {
                data.senderImg = `${process.env.APP_URL}${data.senderImg}`
              }
              if (data.recipientImg !== null && !data.recipientImg.startsWith('http')) {
                data.recipientImg = `${process.env.APP_URL}${data.recipientImg}`
              }
            })
            response(res, 200, true, `Your chat with user ${data.recipient}`, user)
          } else {
            console.log('ini eror', err)
            response(res, 401, false, `Your dont have chat conversation with user ${data.recipient}`)
          }
        }
      })
    }
  })
}

exports.deletedChatRoom = (req, res) => {
  const data = req.body
  chatModels.getUserSenderById(req.authUser.id, (err, results) => {
    if (err) {
      response(res, 401, false, 'an error occured')
    } else {
      const user = results[0]
      const userData = { sender: user.phoneNumber, recipient: data.recipient, sender2: user.phoneNumber, recipient2: data.recipient }
      chatModels.deletedAllMessage(userData, (err, results) => {
        if (err) {
          console.log(err)
          response(res, 401, false, 'an error occured on deleting message query')
        } else {
          console.log('ini results', results)
          response(res, 200, true, `Deleted Your chat with user ${data.recipient} succesfully`, results)
        }
      })
    }
  })
}

exports.searchingUsers = (req, res) => {
  const cond = req.query.search || ''
  const limit = parseInt(req.query.limit) || 10
  let offset = parseInt(req.query.offset) || 0
  const page = parseInt(req.query.page) || 1
  offset = (page * limit) - limit
  const pageInfo = {}
  chatModels.searchAndsortUsers(cond, limit, offset, page, (err, results, _fields) => {
    if (err) {
      console.log(err)
      return response(res, 401, false, 'an error occured on searching message query')
    } else {
      // return response(res, 200, true, 'list of users', results)
      if (results.length > 0) {
        chatModels.getUsersCount(cond, (err, resultCount, _fields) => {
          if (err) throw err
          const totalData = resultCount[0].count
          const totalPage = Math.ceil(totalData / limit)
          pageInfo.totalData = totalData
          pageInfo.currentPage = page
          pageInfo.totalPage = totalPage
          pageInfo.limitData = limit
          pageInfo.nextPage = page < totalPage ? `${APP_URL}/chats/searchinguser/?search=${cond}&page=${page + 1}` : null
          pageInfo.prevPage = page > 1 ? `${APP_URL}/chats/searchinguser/?search=${cond}&page=${page - 1}` : null
          const finalResults = results
          console.log('ini results', results)
          finalResults.map((user) => {
            if (user.img !== null && !user.img.startsWith('http')) {
              user.img = `${process.env.APP_URL}${user.img}`
            }
          })
          return response(res, 200, true, 'List of users', finalResults, pageInfo)
        })
      } else {
        response(res, 401, false, 'an error occured on searching message query')
      }
    }
  })
}
