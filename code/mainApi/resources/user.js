const express = require('express');
const fs = require('fs')
const bodyParser = require("body-parser")
const router = express.Router();

const mainUri = 'localhost:3000'

const jsonHelper = require("../help/JsonHelper");

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))


// return all mitbewohner inside wg
router.get('/:wgID', (req,res)=>{
    fs.readFile(jsonHelper.pathToJson, (err,data)=>{
        if(err){
            res.status(500).json(err)
        }
        const content = JSON.parse(data)
        for(i in content){
            if(content[i].name == req.params.wgID){
                return res.status(200).json(content[i])
            }
        }

        return res.status(400).json({
            status : "BAD REQUEST",
            message : "WG could not be found"
        })
    })
})

module.exports = [
    router
]