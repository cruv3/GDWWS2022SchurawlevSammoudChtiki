const fetch = require("node-fetch");
const fs = require("fs")

// module
const SD = require('../../db/sdSchema')
const MB = require('../../db/mbSchema')
const WG = require('../../db/wgSchema')

const mainUri = 'localhost:3000'

async function findSD(wgname, mbname) {
    return new Promise((resolve, reject) => {
        SD.find({ wg_name: wgname, mb_name: mbname }, (error, data) => {
            if (error) {
                reject(error)
            } else if (data.length == 0) {
                reject(`could not find ${wgname} or ${mbname}`)
            } else {
                resolve(data)
            }
        })
    })
}

async function sumSD(wgname) {
    return new Promise((resolve, reject) => {
        // get all mb in wg
        MB.find({ wg_name: wgname }, (error, data) => {
            if (error) {
                reject(error)
            } else if (data.length == 0) {
                reject(`could not find ${wgname}`)
            } else {
                let wgMB = []
                for (i in data) {
                    wgMB.push(data[i].mb_name)
                }

                // go trough the members 
                for (i in wgMB) {
                    SD.find({ wg_name: wgname, wohlhaber: wgMB[i] }, (error, data) => {
                        if (error) {
                            reject(error)
                        } else {
                            let schuld = []
                            let endresult = []
                            for (i in data) {
                                // betrag wird aufgeteilt
                                let geteilt = Math.round(parseFloat(data[i].summe) / (data[i].schuldner.length + 1))

                                // durch die schuldner liste durchgehen
                                for (x in data[i].schuldner) {
                                    let name = data[i].schuldner[x]

                                    let schuldner = {
                                        name: name,
                                        Schuld: geteilt
                                    }

                                    schuld.push([
                                        data[i].wohlhaber,
                                        schuldner
                                    ])
                                }
                            }
                            let summe = 0
                            for (i in schuld) {
                                console.log(schuld[i])
                                for (i in wgMB) {
                                    if (schuld[i][1].name == wgMB[i]) {
                                        summe += schuld[i][1].Schuld
                                    }
                                }
                            }
                            console.log(summe)
                        }
                    })
                }
            }
        })
    })
}

async function createSD(wgname, mbname, sdname, wohlhaber, summe) {
    return new Promise((resolve, reject) => {
        // Check ob wg existiert
        WG.findOne({ wg_name: wgname }, (error, data) => {
            if (error) {
                reject(error)
            } else {
                if (!data)
                    reject(`could not find ${wgname}`)
                else {
                    //check ob mb existiert
                    MB.findOne({ mb_name: mbname }, async (error, data) => {
                        if (error) {
                            reject(error)
                        } else {
                            if (!data)
                                reject(`could not find ${mbname}`)
                            else {
                                
                                let sd = new SD()
                                sd.uri = mainUri + '/sd/' + wgname + "/" + mbname + "/" + sdname
                                sd.wg_name = wgname
                                sd.mb_name = mbname
                                sd.sd_name = sdname
                                sd.wohlhaber = wohlhaber
                                sd.summe = summe

                                if (summe == undefined) {
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
                                            return ratesJson.rates.EUR
                                        }).then(async (rate) => {
                                            let path = "/../../../poc/prices.json"
                                            await fs.readFile(__dirname + path, (err, data) => {
                                                if (err) throw (err)
                                                obj = JSON.parse(data)
                                                for (i in obj) {
                                                    if (obj[i].product.toUpperCase().includes(sdname.toUpperCase())) {

                                                        var price = obj[i].price.substring(1)
                                                        var newPrice = (parseFloat(price) * rate).toFixed(2)

                                                        summe = parseFloat(newPrice)

                                                        sd.summe = summe


                                                        sd.save((error) => {
                                                            if (error) {
                                                                reject(error)
                                                            } else {
                                                                resolve(sd)
                                                            }
                                                        })
                                                    }
                                                }
                                            })
                                        }).catch((err) => {
                                            reject(err)
                                        })
                                } else {

                                    sd.save((error) => {
                                        if (error) {
                                            reject(error)
                                        } else {
                                            resolve(sd)
                                        }
                                    })
                                }
                            }
                        }
                    })
                }
            }
        })
    })
}

async function deleteSD(wgname, mbname, sdname) {
    return new Promise((resolve, reject) => {
        SD.deleteOne({ wg_name: wgname, mb_name: mbname, sd_name: sdname }, (error, data) => {
            if (error) {
                reject(error)
            } else if (data.deletedCount == 0) {
                reject(`could not find ${sdname}`)
            } else {
                resolve(sdname)
            }
        })
    })
}

module.exports = {
    findSD: findSD,
    sumSD: sumSD,
    createSD: createSD,
    deleteSD: deleteSD
}