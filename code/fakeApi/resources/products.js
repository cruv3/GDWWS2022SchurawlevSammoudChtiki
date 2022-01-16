const express = require('express');
const fs = require('fs')
const bodyParser = require("body-parser")
const router = express.Router();

const jsonHelper = require('../help/productsHelper')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

router.get('/',(res)=>{
    jsonHelper.getProducts()
        .then((result) => res.status(200).json(result))
})

router.get('/:pID',(req,res)=>{
    jsonHelper.getSpecifigProducts(req.params.pID)
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(404).json({error : error}))
})


module.exports = [
    router
]