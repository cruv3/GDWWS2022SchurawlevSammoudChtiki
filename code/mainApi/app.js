const express = require("express")
const bodyParser = require("body-parser")
const connectDB = require('../mainApi/db/db')
const dotenv = require('dotenv')
// Load config
dotenv.config()
// resources
const apiRoute = require('./resources/api')

const app = express()
app.use(bodyParser.json());

// DB 
connectDB()

// start server
const PORT = process.env.PORT1 || 3001
app.listen( PORT, () => {
    console.log("Server running on port " + PORT);
})

// Routes
app.use('/api', apiRoute);

// Starting Page

app.get('/', (req, res) => {
    res.send('Welcome to the main page')
  })

// ERROR Handling
app.use((req, res, next) => {
    // 404 = Not Found
    const error = new Error('404 Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    // 500 = Internal Error
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = [
    app
]