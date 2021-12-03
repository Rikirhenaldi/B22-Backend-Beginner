const multer = require('multer')
const path = require('path')
const { response } = require('../helpers/standardResponse')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'assets', 'images'))
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.')[1]
    const date = new Date()
    cb(null, `${date.getTime()}.${ext}`)
  }
})

const upload1 = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    const ext = path.extname(file.originalname)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(new Error('Only images are allowed'))
    }
    callback(null, true)
  },
  limits: { fileSize: 1024 * 1024 * 2 }
}).single('img_link')

exports.uploadFilterProduct = (req, res, next) => {
  upload1(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return response(res, 400, false, err.message)
    } else if (err) {
      // An unknown error occurred when uploading.
      return response(res, 500, false, err.message)
    }
    next()
    // Everything went fine.
  })
}

const upload2 = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    const ext = path.extname(file.originalname)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(new Error('Only images are allowed'))
    }
    callback(null, true)
  },
  limits: { fileSize: 1024 * 1024 * 2 }
}).single('img')

exports.uploadFilterImg = (req, res, next) => {
  upload2(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return response(res, 400, false, err.message)
    } else if (err) {
      // An unknown error occurred when uploading.
      return response(res, 500, false, err.message)
    }
    next()
    // Everything went fine.
  })
}
