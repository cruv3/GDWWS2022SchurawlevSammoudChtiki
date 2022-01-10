const express = require('express');
const bodyParser = require("body-parser")
const router = express.Router();
const mainUri = 'localhost:3000'

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

// module
const MB = require('../../db/mbSchema')
const WG = require('../../db/wgSchema')

// mitbewohners schulden in einem wg
// GET localhost:3000/mb/:wgID/:mbID/schulden
router.get('/:wgID/:mbID/schulden', (req, res) => {
    jsonHelper.getSchulden(jsonFileWG, req.params.wgID, req.params.mbID)
        .then((ans) => res.status(200).json(ans))
        .catch(() => res.status(400).json({ error: "could not find" }))
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


// change schulden
//TODO



// delete schulden
//TODO

module.exports = [
    router
]