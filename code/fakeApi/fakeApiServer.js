const express = require("express")
const bodyParser = require('body-parser')
const fs = require('fs')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Routes
const productRoutes = require('./resources/products')

app.use('/products', productRoutes)

app.listen(3001, () => {
 console.log("Server running on port 3001");
});

app.get('/', (req, res) => {
    res.send('welcome to the development api-server');
  });


module.exports = [
    app
]