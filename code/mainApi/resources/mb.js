const express = require('express');
const bodyParser = require("body-parser")
const router = express.Router();
const mainUri = 'localhost:3000'

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

// module
const MB = require('../db/mbSchema')


// alle mitbewohner in Alle WG anzeigen
// GET localhost:3000/mb/:wgID
router.get('/', (req, res) => {
    MB.find({}, (error, data) => {
        if (error) {
            res.status(500).json(error)
            return
        } else {
            res.status(200).json(data)
        }
    })
})

// alle mitbewohner in einem WG anzeigen
// GET localhost:3000/mb/:wgID
router.get('/:wgID', (req, res) => {
    MB.find({ "wg_name": req.params.wgID }, (error, data) => {
        if (error) {
            res.status(500).json(error)
            return
        } else {
            res.status(200).json(data)
        }
    })
})


// mitbewohner in einem wg hinzufügen
// POST localhost:3000/mb/:wgID
router.post('/:wgID', async (req, res) => {
    if (req.body == "{}" || req.body.mb_name == undefined) {
        res.status(400).json({
            message: "Body is empty",
        })
    } else {
        let mb = new MB()
        mb.uri = mainUri + '/mitbewohner/' + req.params.wgID + "/" + req.body.mb_name
        mb.wg_name = req.params.wgID
        mb.mb_name = req.body.mb_name
        mb.schulden = []
        mb.save((error) => {
            if (error) {
                res.status(409).json({
                    status: "mb_name already exist"
                })
                return
            } else {
                res.status(201).json({ status: "created", mb })
            }
        })
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
        try {
            let mb = await MB.findOneAndUpdate({ wg_name: req.params.wgID, mb_name: req.params.mbID },
                {
                    mb_name: req.body.mb_name
                })
        } catch (err) {
            res.status(400).json({
                message: err
            })
            return
        } finally {
            res.status(201).json({ status: "updated" })
        }
    }
})

//mitbewohner loeschen
// DELETE localhost:3000/mb/:wgID/:mbID
router.delete('/:wgID/:mbID', async(req, res) => {
    if (req.params.wgID == undefined|| req.params.mbID == undefined) {
        res.status(400).json({
            message: "params fehlen noch"
        })
    }else{
        try {
            await MB.deleteOne({ wg_name: req.params.wgID, mb_name: req.params.mbID})
            res.status(201).json({ status: "deleted" })
        } catch (err) {
            res.status(400).json({
                message: err
            })
        }
    }
})

module.exports = [
    router
]