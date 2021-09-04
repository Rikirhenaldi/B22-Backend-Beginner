const { sendMessage, createMessage, getChatingList, chatRoom, deletedChatRoom, chatRoomMobile, searchingUsers } = require('../controllers/chats')

const route = require('express').Router()

route.get('/searchinguser/', searchingUsers)
route.post('/createmessage', createMessage)
route.get('/mobilechatroom/', chatRoomMobile)
route.post('/sendmessage', sendMessage)
route.get('/chatroom/', chatRoom)
route.get('/deletechat', deletedChatRoom)
route.get('/', getChatingList)

module.exports = route
