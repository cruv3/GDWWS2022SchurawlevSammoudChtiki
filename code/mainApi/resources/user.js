const express = require('express');
const fs = require('fs')
const bodyParser = require("body-parser")
const router = express.Router();
const mainUri = 'localhost:3000'

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

// module
const MB = require('../../db/userSchema')
const WG = require('../../db/wgSchema')

// alle mitbewohner in einem WG anzeigen
// GET localhost:3000/user/:wgID
router.get('/:wgID', (req, res) => {
    WG.find({ "wg_name": req.params.wgID }, (error, data) => {
        if (error) {
            res.status(500).json(error)
            return
        } else {
            res.status(200).json(data.bewohner)
        }
    })
})

// mitbewohners schulden in einem wg
// GET localhost:3000/user/:wgID/:mbID/schulden
router.get('/:wgID/:mbID/schulden', (req, res) => {
    jsonHelper.getSchulden(jsonFileWG, req.params.wgID, req.params.mbID)
        .then((ans) => res.status(200).json(ans))
        .catch(() => res.status(400).json({ error: "could not find" }))
})

// mitbewohner in einem wg hinzufügen
// POST localhost:3000/user/:wgID
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

        let wgFind = await WG.find({ "wg_name": req.params.wgID })

        // check if array is empty
        if (!wgFind.length) {
            res.status(400).json({
                status: `can not find WG with the name:  ${req.params.wgID}`,
            })
            return
        }
        mb.save((error) => {
            if (error) {
                res.status(409).json({
                    status: "mb_name already exist"
                })
                return
            } else {

                // have to update WG itself
                // funktioniert nicht irgen
                let bewohner = wgFind[0].bewohner
                bewohner.push(req.body.mb_name)

                let wg = new WG()
                wg.uri = wgFind[0].uri
                wg.wg_name = wgFind[0].wg_name
                wg.bewohner = bewohner

                // funktioniert nicht irgendein _id error
                WG.updateOne({ wg_name: req.params.wgID }, wg, (error) => {
                    if (error) {
                        console.log(error)
                        return
                    }
                })
                res.status(201).json({ status: "created", mb })
            }
        })
    }
})

// add schulden to mitbewohner
router.post('/:wgID/:mbID/schulden', (req, res) => {
    if (req.body == "{}") {
        res.status(400).json({
            message: "Body is empty",
            name: req.body.name,
        })
    }
})

//mitbewohner in einem wg bearbeiten
// PUT localhost:3000/user/:wgID/:mbID
router.put('/:wgID/:mbID', (req, res) => {
    if (req.body == "{}" || req.body.name == undefined) {
        res.status(400).json({
            message: "Body is empty",
            name: req.body.name,
        })
    } else {
        const change = {
            name: req.body.name || undefined,
            schulden: req.body.schulden || []
        }
    }
})

// change schulden
//TODO

//mitbewohner loeschen
// DELETE localhost:3000/user/:wgID/:mbID
router.delete('/:wgID/:mbID', (req, res) => {
    if (req.body == "{}" || req.body.name == undefined) {
        res.status(400).json({
            message: "Body is empty",
            name: req.body.name,
        })
    }
})

// delete schulden
//TODO

module.exports = [
    router
]