const express = require('express');
const bodyParser = require("body-parser")
const router = express.Router();

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))


// functionHelper
const WG = require('./functions/wgHelper')

// Alle WGs ausgeben 
// GET localhost:3000/wg
router.get('/', (req, res) => {
    WG.findWG()
        .then(result => res.status(200).json({result}))
        .catch(error => res.status(400).json({error : error}))
})

// Ein wg mit Namen finden
// GET localhost:3000/wg/:wgID
router.get('/:wgID', (req, res) => {
    WG.findWG(req.params.wgID)
        .then(result => res.status(200).json({result}))
        .catch(error => res.status(400).json({error : error}))
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

        WG.createWG(req.body.wg_name)
            .then(result => res.status(201).json({stauts: "created", result}))
            .catch(error => res.status(409).json({status: "wg_name already exist", error: error}))
    }
})

// wg bearbeiten -> name veraendern
// PUT localhost:3000/wg/:wgID
router.put('/:wgID', (req, res) => {
    if (req.body == "{}" || req.body.wg_name == undefined) {
        res.status(400).json({
            message: "Body is empty",
            name: req.body.name,
        })
    } else {

        WG.updateWG(req.params.wgID,req.body.wg_name)
            .then(result => res.status(200).json({stauts: "updated", result}))
            .catch(error => res.status(400).json({error: error}))
    }
})

// wg loeschen
// DELETE localhost:3000/wg/:wgID
router.delete('/:wgID', (req, res) => {
    WG.deleteWG(req.params.wgID)
        .then(result => res.status(200).json({status : "deleted", result}))
        .catch(error => res.status(400).json({error : error}))
})


module.exports = [
    router
]