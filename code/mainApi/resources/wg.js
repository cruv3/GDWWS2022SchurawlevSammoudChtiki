const express = require('express');
const bodyParser = require("body-parser")
const router = express.Router();

const mainUri = 'localhost:3000'

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

// module
const WG = require('../../db/wgSchema')
const MB = require('../../db/mbSchema')

// Alle WGs ausgeben 
// GET localhost:3000/wg
router.get('/', (req, res) => {
    WG.find({}, (error, data) => {
        res.status(200).json(data)
    })
})

// Ein wg mit Namen finden
// GET localhost:3000/wg/:wgID
router.get('/:wgID', (req, res) => {
    if (req.params.wgID) {
        WG.find({ "wg_name": req.params.wgID }, (error, data) => {
            if (error) {
                res.status(400).json(error)
                return
            } else {
                res.status(200).json(data)
            }
        })
    }else{
        res.status(400).json({
            message: "couldnt read params",
        })
    }
})

// WG hinzufügen
// POST localhost:3000/wg/
// wg_name soll im body des requests sein
router.post('/', (req, res) => {
    if (req.body.wg_name == undefined) {
        res.status(400).json({
            message: "Missing Body requierments",
        })
    } else {
        let wg = new WG()
        wg.uri = mainUri + '/wg/' + req.body.wg_name
        wg.wg_name = req.body.wg_name
        wg.bewohner = []

        wg.save((error) => {
            if (error) {
                res.status(409).json({
                    status: "wg_name already exist",
                    error: error
                })
                return
            } else {
                res.status(201).json({ status: "created", wg })
            }
        })
    }
})

// wg bearbeiten -> name veraendern
// PUT localhost:3000/wg/:wgID
router.put('/:wgID', async (req, res) => {
    if (req.body == "{}" || req.body.wg_name == undefined) {
        res.status(400).json({
            message: "Body is empty",
            name: req.body.name,
        })
    } else {

        // updaten
        WG.updateOne({ wg_name: req.params.wgID }, {$set:{
            wg_name : req.body.wg_name,
            uri : mainUri + '/wg/' + req.body.wg_name}}, (error) => {

            if (error) {
                res.status(400).json({status: `could not find ${req.params.wgID}`, error})
                return
            } else {

                // also update all mitbewohner
                MB.updateMany({wg_name: req.params.wgID}, {$set:{
                    wg_name : req.body.wg_name,
                    uri : mainUri + '/wg/' + req.body.wg_name}},(error,data)=>{
                        if (error) {
                            console.log(error)
                            return
                        }
                    })
                res.status(201).json({ status: "updated", wg })
            }
        })
    }
})

// wg loeschen
// DELETE localhost:3000/wg/:wgID
router.delete('/:wgID', (req, res) => {
    if (req.body.wg_name == undefined) {
        res.status(400).json({
            message: "Missing Body requierments",
        })
    } else {
        WG.deleteOne({ wg_name: req.params.wgID }, (error) => {
            if (error) {
                res.status(400).json(error)
                return
            } else {

                // also delete mitbewohner

                MB.deleteMany({wg_name : req.params.wgID},(error)=>{
                    if(error){
                        console.log(error)
                        return
                    }
                })

                res.status(201).json({
                    status: "deleted",
                    wg_name : req.params.wgID
                })
            }
        })
    }
})


module.exports = [
    router
]