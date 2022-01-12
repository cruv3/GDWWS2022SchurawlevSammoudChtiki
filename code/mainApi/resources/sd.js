const express = require('express');
const bodyParser = require("body-parser")
const router = express.Router();
const mainUri = 'localhost:3000'
const fs = require("fs")
const fetch = require("node-fetch");

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

// module
const WG = require('../../db/wgSchema')
const MB = require('../../db/mbSchema')
const SD = require('../../db/sdSchema')

// mitbewohners schulden in einem wg
// GET localhost:3000/sd/:wgID/:mbID
router.get('/:wgID/:mbID', (req, res) => {
    // Check ob wg existiert
    WG.findOne({ "wg_name": req.params.wgID }, (error, data) => {
        if (error) {
            res.status(500).json(error)
            return
        } else {
            if (!data)
                res.status(400).json("wg existiert nicht")
            else {
                //check ob mb existiert
                MB.findOne({ "mb_name": req.params.mbID }, (error, data) => {
                    if (error) {
                        res.status(500).json(error)
                        return
                    } else {
                        if (!data)
                            res.status(400).json("mb existiert nicht")
                        else {
                            MB.findOne({ "mb_name": req.params.mbID }, (error, data) => {
                                if (error) {
                                    res.status(500).json(error)
                                    return
                                } else {
                                    SD.find({}, (error, data) => {
                                        if (error) {
                                            res.status(500).json(error)
                                            return
                                        } else {
                                            res.status(200).json(data)
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
            }
        }
    })
})

// add schulden to mitbewohner
// POST localhost:3000/sd/:wgID/:mbID/schulden 
// body params: wg_name:String  mb_name:String  sd_name:String  wohlhaber:String Summe:Number(Optional)
router.post('/:wgID/:mbID', (req, res) => {
    if (req.body.wohlhaber == undefined || req.body.sd_name == undefined) {
        res.status(400).json({
            message: "wohlhaber && sd_name sind notwendig",
            name: req.body.name,
        })
    } else {
        // Check ob wg existiert
        WG.findOne({ "wg_name": req.params.wgID }, (error, data) => {
            if (error) {
                res.status(500).json(error)
                return
            } else {
                if (!data)
                    res.status(400).json("wg existiert nicht")
                else {
                    //check ob mb existiert
                    MB.findOne({ "mb_name": req.params.mbID }, async (error, data) => {
                        if (error) {
                            res.status(500).json(error)
                            return
                        } else {
                            if (!data)
                                res.status(400).json("mb existiert nicht")
                            else {
                                let summe = 0
                                let name = req.body.sd_name
                                if (req.body.summe == undefined) {
                                    //Open Exchange Rate API
                                    // API KEY: d7cafdd25e7d4b7193244ccf6e610329
                                    let open_exchange_rate_api_key = "d7cafdd25e7d4b7193244ccf6e610329"
                                    let open_exchange_rate_api_request = "https://openexchangerates.org/api/latest.json?app_id=" + open_exchange_rate_api_key
                                    //fetch request
                                    await fetch(open_exchange_rate_api_request)
                                        .then((response) => {
                                            return response.json();
                                        })
                                        .then((ratesJson) => {
                                            // USD zu EUR
                                            console.log("USD EUR Rate from Open Exange API: " + ratesJson.rates.EUR);
                                            return ratesJson.rates.EUR
                                        }).then(async (rate, resut) => {
                                            await fs.readFile("poc/prices.json", (err, data) => {
                                                if (err) throw (err)
                                                obj = JSON.parse(data)
                                                for (var fieldIndex = 0; fieldIndex < obj.length; fieldIndex++) {
                                                    if (obj[fieldIndex].product.toUpperCase().includes(name.toUpperCase())) {
                                                        console.log(obj[fieldIndex])
                                                        var price = obj[fieldIndex].price.substring(1)
                                                        var newPrice = (parseFloat(price) * rate).toFixed(2)
                                                        console.log("Price in Euro: " + newPrice)
                                                        summe = parseFloat(newPrice)
                                                        let sd = new SD()
                                                        sd.uri = mainUri + '/sd/' + req.params.wgID + "/" + req.params.wgID + "/" + req.body.sd_name
                                                        sd.wg_name = req.params.wgID
                                                        sd.mb_name = req.params.mbID
                                                        sd.sd_name = req.body.sd_name
                                                        sd.wohlhaber = req.body.wohlhaber
                                                        sd.summe = summe
                                                        console.log("summe from POST: " + summe)
                                                        sd.save((error) => {
                                                            if (error) {
                                                                res.status(500).json(error)
                                                                res.end()
                                                                return
                                                            } else {
                                                                res.status(201).json({ status: "created", sd })
                                                                res.end()
                                                            }
                                                        })
                                                    }
                                                }
                                            })
                                        }).catch((err) => {
                                            console.log(err)
                                        })
                                } else {
                                    summe = req.body.summe
                                    let sd = new SD()
                                    sd.uri = mainUri + '/sd/' + req.params.wgID + "/" + req.params.wgID + "/" + req.body.sd_name
                                    sd.wg_name = req.params.wgID
                                    sd.mb_name = req.params.mbID
                                    sd.sd_name = req.body.sd_name
                                    sd.wohlhaber = req.body.wohlhaber
                                    sd.summe = summe
                                    console.log("summe from POST: " + summe)
                                    sd.save((error) => {
                                        if (error) {
                                            res.status(500).json(error)
                                            res.end()
                                            return
                                        } else {
                                            res.status(201).json({ status: "created", sd })
                                            res.end()
                                        }
                                    })
                                }
                            }
                        }
                    })
                }
            }
        })
    }
})


// delete schulden
// DELETE localhost:3000/sd/:wgID/:mbID
// body params: sd_name:String
router.delete('/:wgID/:mbID', (req, res) => {
    if (req.body.sd_name == undefined) {
        res.status(400).json({
            message: "Missing Body requierments",
        })
    } else {
        SD.deleteOne({ wg_name: req.params.wgID, mb_name: req.params.mbID, sd_name: req.body.sd_name }, (error) => {
            if (error) {
                res.status(400).json(error)
                return
            } else {
                res.status(201).json({
                    status: "deleted"
                })
            }
        })
    }
})




module.exports = [
    router
]