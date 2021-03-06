# ExpressJS - Backend_CoffeeShop RESTfull API

## About
CRUD database for:
1. User
2. Product
3. Category
4. Variant
5. Auth
6. Transactions

## Built With
[![Express.js  v4.17.1](https://img.shields.io/badge/Express%20-v4.17.1-brightgreen.svg?style=flat)](https://expressjs.com/)
[![Node.js v14.17.3](https://img.shields.io/badge/Node%20-v14.17.3-blue.svg?style=flat)](https://nodejs.org/en/)



## Requirements
1. [NodeJs](https://nodejs.org/en/)
2. Node_modules
3. [Postman](https://www.getpostman.com/)
4. Web Server (ex. localhost)

## How to run the app ?

1. Open app's directory in CMD or Terminal
2. Type npm install
3. Make new file a called .env, set up first
4. Turn on Web Server and MySQL can using Third-party tool like xampp, etc.
5. Create a database with the name #nama_database, and Import file sql to phpmyadmin
6. Open Postman desktop application or Chrome web app extension that has installed before
7. Choose HTTP Method and enter request url.(ex. localhost:3000/)
8. You can see all the end point [here](https://documenter.getpostman.com/view/15532539/Tzscq7Aa)

## Set up .env file
Open .env file on your favorite code editor, and copy paste this code below :

``` 
NODE_ENV=development

APP_URL=http://localhost:8080
APP_KEY=
APP_UPLOADS_ROUTE=/uploads
APP_UPDATE_ROUTE=/editprofile
APP_UPLOADS_PATH=assets/images
APP_TRANSACTION_PREFIX=CS

DB_HOST=localhost
DB_NAME=db_coffeeshop
DB_USER=root
DB_PASS=
```

## License
<<<<<<< HEAD
© [Riki Rhenaldi](https://github.com/Rikirhenaldi)
=======
© [Riki Rhenaldi](https://github.com/Rikirhenaldi)
>>>>>>> 0c51f9bc4dac815bc03b7312d9dbb44084fed16e
