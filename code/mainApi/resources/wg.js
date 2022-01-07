const express = require('express');
const fs = require('fs')
const bodyParser = require("body-parser")
const router = express.Router();

const mainUri = 'localhost:3000'


router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))


// module
const WG = require('../../db/wgSchema')



// WG ausgeben
router.get('/',(req,res)=>{
    WG.find({},(error, data)=>{
        res.status(200).json(data)
    })
})

router.get('/:wgID',(req,res)=>{
    WG.find({"wg_name":req.params.wgID},(error,data)=>{
        if(error){
            res.status(400).json(error)
            return
        }else{
            res.status(200).json(data)
        }
    })
})

// WG anlegen
router.post('/', (req, res)=>{
    if(req.body.wg_name == undefined){
        res.status(400).json({
            message: "Missing Body requierments",
        })
    }else{
        let wg = new WG()
        wg.uri = mainUri + '/wg/' + req.body.wg_name
        wg.wg_name = req.body.wg_name
        wg.bewohner = []

        wg.save((error)=>{
            if(error){
                res.status(409).json({
                    status : "wg_name already exist",
                    error : error
                })
                return
            }else{
                res.status(201).json({status : "created", wg})
            }
        })
    }
})

// wg bearbeiten -> name veraendern

router.put('/:wgID', async (req,res)=>{
    if(req.body == "{}" || req.body.wg_name == undefined){
        res.status(400).json({
            message: "Body is empty",
            name : req.body.name,
        })
    }else{
        let wg = {}
        wg.uri = mainUri + '/wg/' + req.body.wg_name
        wg.wg_name = req.body.wg_name
        wg.bewohner = []

        // uebernehmen der Bewohner
        let wgFind = await WG.find({"wg_name":req.params.wgID})

        if(!wgFind.length){
            res.status(400).json({
                stauts: `could not find ${req.params.wgID}`
            })
        }

        // updaten
        WG.updateOne({wg_name : req.params.wgID}, wg, (error)=>{
            if(error){
                res.status(400).json(error)
                return
            }else{
                res.status(201).json({status: "updated", wg})
            }
        })
    }
})

// wg loeschen

router.delete('/:wgID', (req,res)=>{
    if(req.body.wg_name == undefined){
        res.status(400).json({
            message: "Missing Body requierments",
        })
    }else{
        WG.deleteOne({wg_name : req.params.wgID}, (error)=>{
            if(error){
                res.status(400).json(error)
                return
            }else{
                res.status(201).json({
                    status : "deleted"
                })
            }
        })
    }
})


module.exports = [
    router
]