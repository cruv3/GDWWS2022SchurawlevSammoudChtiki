const fetch = require("node-fetch");
const fs = require("fs")

// module
const SD = require('../../db/sdSchema')
const MB = require('../../db/mbSchema')
const WG = require('../../db/wgSchema')

const mainUri = 'localhost:3000'

// functionHelper
const MB_helper = require('./mbHelper')

async function findSD(wgname, mbname) {
    return new Promise((resolve, reject) => {
        SD.find({ wg_name: wgname, mb_name: mbname }, (error, sdData) => {
            if (error) {
                reject(error)
            } else if (sdData.length == 0) {
                reject(`could not find ${wgname}, or ${mbname}, or credits`)
            } else {
                MB_helper.findMB(wgname)
                    .then(mbData => {
                        let schuldenArray = [{}]
                        for (i = 0; i < mbData.length; i++) {
                            var summe = 0;
                            for (j = 0; j < sdData.length; j++) {
                                if (sdData[j].wohlhaber == mbData[i])
                                    summe += sdData[j].summe
                            }
                            let obj = { schulden_an: mbData[i].mb_name, summe: summe }
                            schuldenArray.push(obj) 

                        }
                        let res = {schuldenArray, sdData}
                        console.log(res)
                        resolve(res)
                    })
                    .catch(error => console.log(error),reject(error))
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
                                    let open_exchange_rate_api_key = process.env.API_KEY
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
                                                let found = false
                                                for (i in obj) {
                                                    if (obj[i].product.toUpperCase() == sdname.toUpperCase()) {
                                                        found = true
                                                        var price = obj[i].price.substring(1)
                                                        var newPrice = (parseFloat(price) * rate).toFixed(2)
                                                        summe = parseFloat(newPrice)
                                                        sd.summe = summe
                                              
                                                        sd.save((error) => {
                                                            if (error) {
                                                                reject(error)
                                                            }
                                                        })
                                                    }
                                                }
                                           
                                                if(!found){
                                                    reject(`can't find ${sdname}`)
                                                }else{
                                                    resolve(sd)
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
    createSD: createSD,
    deleteSD: deleteSD
}