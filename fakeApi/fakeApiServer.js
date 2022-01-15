const express = require("express")
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
// Load config
dotenv.config()

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Routes
const productRoutes = require('./resources/products')


app.use('/api/products', productRoutes)

// start server
const PORT = process.env.PORT || 3000
app.listen( PORT, () => {
    console.log("Server running on port " + PORT);
});

app.get('/', (req, res) => {
    res.send('welcome to the development api-server');
  });


module.exports = [
    app
]