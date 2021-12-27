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

// add to json inside mitbewohner, a mitbewohner
router.post('/:wgID',(req,res)=>{
    if(req.body == {} || req.body.mitbewohner == undefined){
        res.status(400).json({
            message: "Body in PUT is empty",
            mitbewohner : req.body.mitbewohner,
        })
    }

    fs.readFile(jsonHelper.pathToJson, (err,data)=>{
        if(err){
            res.status(500).json(err)
        }

        const content = JSON.parse(data)

        for(i in content){
            if(content[i].name == req.params.wgID){
                // change file 
                return
            }
        }

        return res.status(400).json({
            status : "BAD REQUEST",
            message : "WG could not be found"
        })
    })
})

// change in mitbewohner, the mitbewohner
router.put('/:wgID/:mbID',(req, res)=>{

})

// delete user from json file
router.delete('/:wgID/:mbID', (req,res) =>{

})


module.exports = [
    router
]