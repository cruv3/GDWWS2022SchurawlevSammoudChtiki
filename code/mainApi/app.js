const express = require("express")
const bodyParser = require("body-parser")
const connectDB = require('../db/db')

// resources
const wgRoutes = require('./resources/wg')
const userRoutes = require('./resources/user')


const app = express()
app.use(bodyParser.json());

// DB 
connectDB()



// start server
app.listen(3000, () => {
    console.log("Server running on port 3000");
})

// Routes
app.use('/wg', wgRoutes);
app.use('/mitbewohner', userRoutes)

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