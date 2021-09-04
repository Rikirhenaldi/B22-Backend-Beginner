const db = require('../helpers/db')
const table = 'chats'

exports.createMessage = (data, cb) => {
  db.query(`
  INSERT INTO ${table} ( message, sender, recipient, isLatest, deletedAt)
  VALUES (?, ?, ?, ?, ?)`, [data.message, data.sender, data.recipient, data.isLatest = 1, data.deletedAt], cb)
}

exports.getMessage = (data, cb) => {
  db.query(`
  SELECT chats.id, message, sender, recipient, u1.name as senderName, u1.img as senderImg, u2.name as recipientName, u2.img as recipientImg FROM ${table} 
  LEFT JOIN users u1 ON u1.phoneNumber = chats.sender
  LEFT JOIN users u2 ON u2.phoneNumber = chats.recipient
  WHERE chats.sender IN (? ,?) AND chats.recipient IN (?, ?)
  GROUP BY chats.id
  ORDER BY chats.created_at ASC
  `
  , [data.sender, data.recipient, data.sender, data.recipient], cb)
}

exports.getMessageMobile = (data, cb) => {
  db.query(`
  SELECT chats.id, message, sender, recipient, u1.name as senderName, u1.img as senderImg, u2.name as recipientName, u2.img as recipientImg FROM ${table} 
  LEFT JOIN users u1 ON u1.phoneNumber = chats.sender
  LEFT JOIN users u2 ON u2.phoneNumber = chats.recipient
  WHERE chats.sender IN (? ,?) AND chats.recipient IN (?, ?)
  GROUP BY chats.id
  ORDER BY chats.created_at DESC
  `
  , [data.sender, data.recipient, data.sender, data.recipient], cb)
}

exports.deletedAllMessage = (data, cb) => {
  db.query(`
  DELETE FROM ${table} WHERE chats.sender IN (? ,?) AND chats.recipient IN (?, ?)
  ORDER BY created_at DESC`
  , [data.sender, data.recipient, data.sender, data.recipient], cb)
}

exports.chatingList = (data, cb) => {
  db.query(`
  SELECT chats.id, message, sender, recipient, u1.name as senderName, u1.img as senderImg, u2.name as recipientName, u2.img as recipientImg FROM chats 
  LEFT JOIN users u1 ON u1.phoneNumber = chats.sender
  LEFT JOIN users u2 ON u2.phoneNumber = chats.recipient
  WHERE (sender=? or recipient=?) AND isLatest =?
  GROUP BY chats.id
  ORDER BY chats.created_at DESC
  `,
  [data.sender, data.recipient, data.isLatest = 1], cb)
}

exports.getUserByPhoneNumber = (phoneNumber, cb) => {
  db.query(`
  SELECT users.name, users.img, users.phoneNumber,chats.message, chats.isLatest FROM users 
  LEFT JOIN chats ON users.phoneNumber = chats.sender
  WHERE phoneNumber=? AND chats.isLatest =?  
  `,
  [phoneNumber, isLatest = 1], cb)
}

exports.updateIsLatest = (data, cb) => {
  db.query(`
  UPDATE ${table} SET isLatest=?
  WHERE (sender=? or sender=?) AND (recipient=? or recipient=?)
  `, [data.isLatest, data.sender, data.recipient, data.sender, data.recipient], cb)
  console.log('ini data masuk ke query', data)
}

exports.updatePullMessage = (data, cb) => {
  db.query(`
  UPDATE ${table} SET deletedAt=?
  WHERE sender=?
  `, [data.deletedAt, data.sender], cb)
}

exports.getUserSenderById = (id, cb) => {
  db.query(`
  SELECT users.id, users.address, users.name, users.email, users.phoneNumber FROM users
  LEFT JOIN chats ON chats.sender = users.phoneNumber
  WHERE users.id=?
  GROUP BY id
  `, [id], cb)
}

exports.searchAndsortUsers = (cond, limit, offset, page, cb) => {
  const data = db.query(`
  SELECT name, img, phoneNumber FROM users
  WHERE users.name LIKE '%${cond}%' OR users.phoneNumber LIKE '%${cond}%'
  ORDER BY users.name ASC
  LIMIT ${limit} OFFSET ${offset}
  `, [cond, limit, offset], cb)
  console.log(data);
}

exports.getUsersCount = (cond, cb) => {
  db.query(`
    SELECT COUNT (users.id) as count FROM users
    WHERE users.name LIKE '%${cond}%' OR users.phoneNumber LIKE '%${cond}%'`
  , cb)
}
