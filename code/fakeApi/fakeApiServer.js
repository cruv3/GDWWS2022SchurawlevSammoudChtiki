const express = require("express")
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
// Load config
dotenv.config()

const app = express()

app.use(bodyParser.json())

// Routes
const productRoutes = require('./resources/products')


app.use('/api/products', productRoutes)

// start server
const PORT = process.env.PORT2 || 3002
app.listen( PORT, () => {
    console.log("Server running on port " + PORT);
});

app.get('/', (req, res) => {
    res.send('welcome to the development api-server');
  });


module.exports = [
    app
]