const express = require('express');
const bodyParser = require("body-parser")
const router = express.Router();

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

// functionHelper
const WG = require('./functions/wgHelper')
const MB = require('./functions/mbHelper')
const SD = require('./functions/sdHelper')

//**************************************************************************************************
//*******************************************     WG     *******************************************
//**************************************************************************************************

// Alle WGs ausgeben 
// GET localhost:3000/api/wg
router.get('/wg', (req, res) => {
    WG.findWG()
        .then(result => res.status(200).json({result}))
        .catch(error => res.status(400).json({error : error}))
})

// Ein wg mit Namen finden
// GET localhost:3000/api/wg/:wgID
router.get('/wg/:wgID', (req, res) => {
    WG.findWG(req.params.wgID)
        .then(result => res.status(200).json({result}))
        .catch(error => res.status(400).json({error : error}))
})

// WG hinzufügen
// POST localhost:3000/api/wg/
// req body : wg_name:String 
router.post('/wg', (req, res) => {
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
// PUT localhost:3000/api/wg/:wgID
// req body: wg_name:String
router.put('/wg/:wgID', (req, res) => {
    if (req.body == "{}" || req.body.wg_name == undefined) {
        res.status(400).json({
            message: "Body is empty"
        })
    } else {

        WG.updateWG(req.params.wgID,req.body.wg_name)
            .then(result => res.status(200).json({stauts: "updated", result}))
            .catch(error => res.status(400).json({error: error}))
    }
})

// wg loeschen
// DELETE localhost:3000/api/wg/:wgID
router.delete('/wg/:wgID', (req, res) => {
    WG.deleteWG(req.params.wgID)
        .then(result => res.status(200).json({status : "deleted", result}))
        .catch(error => res.status(400).json({error : error}))
})

//**************************************************************************************************
//*******************************************     MB     *******************************************
//**************************************************************************************************

// alle mitbewohner in Alle WG anzeigen
// GET localhost:3000/api/wg/mb/
router.get('/wg/:wgID/mb/', (req, res) => {
    MB.findMB(undefined)
        .then(result => res.status(200).json(result))
        .catch(error => res.status(400).json(error))
})

// alle mitbewohner in einem WG anzeigen
// GET localhost:3000/api/wg/:wgID/mb/
router.get('/wg/:wgID/mb/', (req, res) => {
    MB.findMB(req.params.wgID)
        .then(result => res.status(200).json(result))
        .catch(error => res.status(400).json(error))
})

// mitbewohner in einem wg hinzufügen
// POST localhost:3000/api/wg/:wgID/mb
// req body: [{mb_name:String}]
router.post('/wg/:wgID/mb', async (req, res) => {
    if (req.body.mb_name == undefined ) {
        res.status(400).json({
            message: "Body is empty",
        })
    } else {

        MB.createMB(req.params.wgID, req.body.mb_name)
            .then(result => res.status(200).json({ status: "created", result }))
            .catch(err => res.status(400).json({error : err}))

    }
})

//mitbewohner in einem wg bearbeiten
// PUT localhost:3000/api/wg/:wgID/mb/:mbID
//req body: mb.name:String
router.put('/wg/:wgID/mb/:mbID', async (req, res) => {
    if (req.body == "{}" || req.body.mb_name == undefined) {
        res.status(400).json({
            message: "Body is empty"
        })
    } else {

        MB.updateMB(req.params.wgID, req.params.mbID, req.body.mb_name)
            .then(result => res.status(200).json({ status: "updated", mb_name: result }))
            .catch(err => res.status(400).json({ error: err }))
    }
})

//mitbewohner loeschen
// DELETE localhost:3000/api/wg/:wgID/mb/:mbID
router.delete('/wg/:wgID/mb/:mbID', async (req, res) => {
    MB.deleteMB(req.params.wgID, req.params.mbID)
        .then(result => { res.status(200).json({ status: "deleted", mb: result }) })
        .catch(err => res.status(400).json({ error: err }))
})

//**************************************************************************************************
//*******************************************     SD     *******************************************
//**************************************************************************************************

// Schuldensumme in dem WG
// GET localhost:3000/api/wg/:wgID/sd
router.get('/wg/:wgID/sd', (req,res)=>{
    SD.sumSD(req.params.wgID)
        .then(result => res.status(200).json(result))
        .catch(error => res.status(400).json(error))
})

// mitbewohners schulden in einem wg
// GET localhost:3000/api/wg/:wgID/mb/:mbID/sd
router.get('/wg/:wgID/mb/:mbID/sd', (req, res) => {
    SD.findSD(req.params.wgID, req.params.mbID)
        .then(result => res.status(200).json(result))
        .catch(error => res.status(400).json({error: error}))
})

// multi schulden to mitbewohner
// POST localhost:3000/api/wg/:wgID/mb/:mbID/sd
// req body: sd_name:String,  wohlhaber:String, Summe:Number(Optional)
router.post('/wg/:wgID/mb/:mbID/sd', async (req, res) => {
    let counterCheck = 0
    let added = []
    let errors = []
    // syntax check for everthing inside the body
    for(i in req.body){
        if (req.body[i].bezahler == undefined || req.body[i].sd_name == undefined) {
            res.status(400).json({
                message: "bezahler && sd_name sind notwendig",
                at : req.body[i]
            })
        }else{
            counterCheck++
        }
    }
    // only start if every syntax inside body is correct
    if(counterCheck == req.body.length){
        for(i in req.body){
            await SD.createSD(req.params.wgID,req.params.mbID,req.body[i].sd_name,req.body[i].bezahler,req.body[i].betrag,req.body[i].profitierer)
            .then(result => added.push(result))
            .catch(error => errors.push(error))
        }
        if(errors.length > 0){
            res.status(201).json({status : "created", added : added, errors : errors})
        }else{
            res.status(201).json({status: "created", added:added})
        }
    }
})

// delete schulden
// DELETE localhost:3000/api/wg/:wgID/mb/:mbID/sd/:sdID
router.delete('/wg/:wgID/mb/:mbID/sd/:sdID', (req, res) => {
        SD.deleteSD(req.params.wgID, req.params.mbID, req.params.sdID)
            .then(result => res.status(200).json({status : "deleted", result}))
            .catch(error => res.status(400).json({error : error}))
})

module.exports = [
    router
]