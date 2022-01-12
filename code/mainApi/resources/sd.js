const express = require('express');
const bodyParser = require("body-parser")
const router = express.Router();
const mainUri = 'localhost:3000'
const fs = require("fs")
const fetch = require("node-fetch");

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

// functionHelper
const SD = require('./functions/sdHelper')

// mitbewohners schulden in einem wg
// GET localhost:3000/sd/:wgID/:mbID
router.get('/:wgID/:mbID', (req, res) => {
    SD.findSD(req.params.wgID, req.params.mbID)
        .then(result => res.status(200).json(result))
        .catch(error => res.status(400).json({error: error}))
})

// Schuldensumme in dem WG
// GET localhost:3000/sd/:wgID
router.get('/:wgID', (req,res)=>{
    SD.sumSD(req.params.wgID)
        .then(result => res.status(200).json(result))
        .catch(error => res.status(400).json(error))
})

// add schulden to mitbewohner
// POST localhost:3000/sd/:wgID
// 
router.post('/:wgID', (req, res) => {
    if (req.body[0] == undefined || req.body[0].sd_name == undefined, req.body[0].wohlhaber == undefined) {
        res.status(400).json({
            message: "wohlhaber && sd_name sind notwendig",
            name: req.body.name,
        })
    }else {
        SD.createSD(req.params.wgID,req.body)
            .then(result => res.status(201).json({status : "created", result}))
            .catch(error => res.status(400).json({error : error}))
    }
})


// delete schulden
// DELETE localhost:3000/sd/:wgID/:mbID
// body params: sd_name:String
router.delete('/:wgID/:mbID', (req, res) => {
    if (req.body.sd_name == undefined) {
        res.status(400).json({
            message: "Missing Body requierments",
        })
    } else {
        SD.deleteSD(req.params.wgID, req.params.mbID, req.body.sd_name)
            .then(result => res.status(200).json({status : "deleted", result}))
            .catch(error => res.status(400).json({error : error}))
    }
})




module.exports = [
    router
]