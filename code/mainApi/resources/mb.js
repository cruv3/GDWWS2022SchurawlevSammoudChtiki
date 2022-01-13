const express = require('express');
const bodyParser = require("body-parser")
const router = express.Router();

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

// functionHelper
const MB = require('./functions/mbHelper')


// alle mitbewohner in Alle WG anzeigen
// GET localhost:3000/mb/:wgID
router.get('/', (req, res) => {
    MB.findMB(undefined)
        .then(result => res.status(200).json(result))
})

// alle mitbewohner in einem WG anzeigen
// GET localhost:3000/mb/:wgID
router.get('/:wgID', (req, res) => {
    MB.findMB(req.params.wgID)
        .then(result => res.status(200).json(result))
        .catch(error => res.status(404).json(error))
})


// mitbewohner in einem wg hinzufügen
// POST localhost:3000/mb/:wgID
// [{mb_name : "test"},{mb_name : "test1"},...]
router.post('/:wgID', async (req, res) => {
    if (req.body[0] == undefined || req.body[0].mb_name == undefined) {
        res.status(400).json({
            message: "Body is empty",
        })
    } else {

        MB.createMB(req.params.wgID, req.body)
            .then(result => res.status(201).json({ status: "created", result }))
            .catch(err => res.status(404).json({error : err}))

    }
})

//mitbewohner in einem wg bearbeiten
// PUT localhost:3000/mb/:wgID/:mbID
router.put('/:wgID/:mbID', async (req, res) => {
    if (req.body == "{}" || req.body.mb_name == undefined) {
        res.status(400).json({
            message: "Body is empty"
        })
    } else {

        MB.updateMB(req.params.wgID, req.params.mbID, req.body.mb_name)
            .then(result => res.status(202).json({ status: "updated", mb_name: result }))
            .catch(err => res.status(404).json({ error: err }))
    }
})

//mitbewohner loeschen
// DELETE localhost:3000/mb/:wgID/:mbID
router.delete('/:wgID/:mbID', async (req, res) => {
    MB.deleteMB(req.params.wgID, req.params.mbID)
        .then(result => { res.status(202).json({ status: "deleted", mb: result }) })
        .catch(err => res.status(404).json({ error: err }))
})

module.exports = [
    router
]