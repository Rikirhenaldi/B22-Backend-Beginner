require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const cors = require('cors')
const { APP_UPLOADS_ROUTE, APP_UPDATE_ROUTE, APP_UPLOADS_PATH, PORT } = process.env

app.use(bodyParser.urlencoded({ extended: false }))
// const whiteList = ['http//localhost:3000']
app.use(cors())
app.use(APP_UPLOADS_ROUTE, express.static(APP_UPLOADS_PATH))
app.use(APP_UPDATE_ROUTE, express.static(APP_UPLOADS_PATH))

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:8080', "https://coffee-shop-app24.herokuapp.com/"]
  }
})
io.on("connection", () => { console.log('connection socket exist')})

const socket = require('./src/middlewares/socket')
app.use(socket(io))

const productRouter = require('./src/routes/products')
const categoriesRouter = require('./src/routes/categories')
const variantsRouter = require('./src/routes/variants')
const authRouter = require('./src/routes/auth')
const chatRouter = require('./src/routes/chats')
const transactionRouter = require('./src/routes/transactions')
const auth = require('./src/middlewares/auth')

app.use('/products', productRouter)
app.use('/category', categoriesRouter)
app.use('/variant', variantsRouter)
app.use('/auth', authRouter)
app.use('/private', auth, transactionRouter) // authnya dihapus dulu tadi kalaugk ada authnya.
app.use('/chats', auth, chatRouter)

app.get('/', (req, res) => {
  const data = {
    succsess: true,
    message: 'Backend is running well'
  }
  return res.json(data)
})

server.listen(process.env.PORT || 8080, () => {
  console.log(`App runing on port ${process.env.PORT}`)
})


// server.listen(process.env.PORT || 3000, function(){
//   console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
// });

// SELECT items.id, items.name, categories.id as category_id, categories.name as category_name FROM items LEFT JOIN item_categories ON item_categories.item_id = items.id LEFT JOIN categories ON item_categories.category_id = categories.id WHERE categories.id = 1
