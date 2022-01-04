const express = require('express');
const fs = require('fs')
const bodyParser = require("body-parser")
const router = express.Router();

const mainUri = 'localhost:3000'

const jsonHelper = require("../help/wgHelper");
const jsonFileWG = "../mainApi/db/wg.json"

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))



// WG ausgeben
router.get('/',(req,res)=>{
    jsonHelper.getData(jsonFileWG).then((ans)=>{
        if(ans){
            res.status(200).json(ans)
        }      
    })
})

router.get('/:wgID',(req,res)=>{
    jsonHelper.getSpecificWg(jsonFileWG,req.params.wgID).then((ans)=>{
        if(ans){
            res.status(200).json(ans)
        }else{
            res.status(400).json({error: "Could not find"})
        }      
    })
})

// WG anlegen
router.post('/', (req, res)=>{
    if(req.body.name == undefined){
        res.status(400).json({
            message: "Missing Body requierments",
        })
    }

    jsonHelper.checkIfWGExist(jsonFileWG, req.body.name).then((found) =>{
        if(found == true){
            res.status(409).json({
                error: "A WG with this name already exist"
            })
        }else{
            const newWG = {
                uri: mainUri + '/wg/' + req.body.name,
                name : req.body.name,
                mitbewohner: []
            }

            jsonHelper.addToJson(jsonFileWG, newWG).then((writing) =>{
                if(writing == false){
                    return res.status(500).json({
                        error: "internal error"
                    })
                }

                res.status(201).json({
                    status: "added",
                    newWG
                })
            })
        }
    })
})

// wg bearbeiten -> name veraendern

router.put('/:wgID', (req,res)=>{
    if(req.body == "{}" || req.body.name == undefined){
        res.status(400).json({
            message: "Body is empty",
            name : req.body.name,
        })
    }else{
        const newWG = {
            uri: mainUri + '/wg/' + req.body.name,
            name : req.body.name,
            mitbewohner: req.body.mitbewohner || undefined
        }

        jsonHelper.changeWG(jsonFileWG, req.params.wgID, newWG).then((changed)=>{
            if(changed){
                res.status(200).json({
                    status : "processed",
                    newWG
                })
            }else{
                res.status(400).json({
                    status : "BAD REQUEST",
                    message : "WG could not be found"
                })
            }
        })  
    }
})

// wg loeschen

router.delete('/:wgID', (req,res)=>{
    if(req.body.name == undefined){
        res.status(400).json({
            message: "Missing Body requierments",
        })
    }
    jsonHelper.deleteWG(jsonFileWG,req.params.wgID).then((found)=>{
        if(found == true){
            res.status(200).json({
                status : "deleted",
                WG : req.params.wgID
            })
        }else{
            res.status(400).json({
                status : "BAD REQUEST",
                message : "WG could not be found"
            })
        }
    })
})


module.exports = [
    router
]