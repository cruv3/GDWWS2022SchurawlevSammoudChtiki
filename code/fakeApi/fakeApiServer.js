const express = require("express")
const bodyParser = require('body-parser')
const fs = require('fs')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const routes = require('./routes/routes.js')(app, fs);

app.listen(3001, () => {
 console.log("Server running on port 3001");
});

app.get('/product',(req,res,next)=>{
    res.json("./data.json")
})