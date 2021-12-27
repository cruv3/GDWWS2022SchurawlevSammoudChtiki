const express = require('express');
const fs = require('fs')
const bodyParser = require("body-parser")
const router = express.Router();

const mainUri = 'localhost:3000'

const jsonHelper = require("../help/JsonHelper");

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))



// WG ausgeben
router.get('/',(req,res)=>{
    fs.readFile(jsonHelper.pathToJson, (err,data)=>{
        if(err){
            res.status(500).json(err)
        }
        const content = JSON.parse(data)
        res.status(200).json(content)
    })
})

// WG anlegen
router.post('/', (req, res)=>{
    if(req.body.name == undefined){
        res.status(400).json({
            message: "Missing Body requierments",
        })
    }

    fs.readFile(jsonHelper.pathToJson, (err,data)=>{
        if(err){
            res.status(400).json(err)
        }
        const content = JSON.parse(data)

        // checks if wg already exist
        for(i in content){
            if(content[i].name == req.body.name){
                return res.status(409).json({
                    WG_Name: "A WG with this name already exist"
                })
            }
        }

        // if not add to json

        const newWG = {
            uri: mainUri + '/wg/' + req.body.name,
            name : req.body.name,
            mitbewohner: []
        }

        content.push(newWG)
        fs.writeFile(jsonHelper.pathToJson, JSON.stringify(content, null, 4), (err)=>{
            if (err){
                res.status(500).json(err) 
            }
        })
        res.status(201).json({
            status: "added",
            newWG
        })
    })
})

// wg bearbeiten

router.put('/:wgID', (req,res)=>{
    if(req.body == "{}" || req.body.name == undefined){
        res.status(400).json({
            message: "Body in PUT is empty",
            name : req.body.name,
        })
    
    }
    // loescht und erstellt neue wg -> keine bearbeitung
    const newWG = {
        uri: mainUri + '/wg/' + req.body.name,
        name : req.body.name,
        mitbewohner: []
    }

    fs.readFile(jsonHelper.pathToJson, (err,data)=>{
        if(err){
            res.status(500).json(err)
        }
        const content = JSON.parse(data)
        for(i in content){
            if(content[i].name == req.params.wgID){
                content.splice(i,1)

                content.push(newWG)
                fs.writeFile(jsonHelper.pathToJson, JSON.stringify(content,null,4), (err)=>{
                    if (err){
                        res.status(500).json(err) 
                    }
                })
                return res.status(200).json({
                    status : "processed"
                })
            }
        }

        return res.status(400).json({
            status : "BAD REQUEST",
            message : "WG could not be found"
        })
    })
})

// wg loeschen

router.delete('/:wgID', (req,res)=>{
    if(req.body.name == undefined){
        res.status(400).json({
            message: "Missing Body requierments",
        })
    }

    fs.readFile(jsonHelper.pathToJson, (err,data)=>{
        if(err){
            res.status(500).json(err)
        }
        const content = JSON.parse(data)
        for(i in content){
            if (content[i].name == req.params.wgID){
                content.splice(i,1)
                fs.writeFile(jsonHelper.pathToJson, JSON.stringify(content, null, 4), (err)=>{
                    if (err){
                        res.status(500).json(err) 
                    }
                })
                return res.status(200).json({
                    status: "deleted"
                })
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