const fetch = require("node-fetch");
const fs = require("fs")

// module
const SD = require('../../db/sdSchema')
const MB = require('../../db/mbSchema')
const WG = require('../../db/wgSchema')

const mainUri = 'localhost:3000'

// functionHelper
const MB_helper = require('./mbHelper')

class Nutzer {
    constructor(mbname, betrag){
        this.mb_name = mbname
        this.schulden = betrag
    }
}

// kalkuliert die Summe fuer jeden mb
async function removeDuplicate(data){
    return new Promise((resolve, reject)=>{

        let summe = 0
        let unique = []
        let end = []
    
        // data needs to be sorted first by name
        data.sort((a, b) =>{
            if(a.mb_name < b.mb_name) { return -1; }
            if(a.mb_name > b.mb_name) { return 1; }
            return 0;
        })
    
        for(i in data){
            let x = 0
            if(!unique.includes(data[i].mb_name)){
                // unique ist empty beim start
                // end.push() nur wenn data[i].mb_name nicht included, somit wurde neuer name gefunden
                if(unique.length != 0){
                    end.push({
                        mb_name : unique[x],
                        schuld : summe
                    })
                }
                summe = 0
                unique.push(data[i].mb_name)
                
                x++
                summe += data[i].schulden
    
                // check if it is the last thing in the loop and make an end.push()
                if(i == data.length - 1){
                    end.push({
                        mb_name : unique[x],
                        schuld : summe
                    })
                }
            }else if(unique.includes(data[i].mb_name) && i == data.length - 1){
                end.push({
                    mb_name : unique[x],
                    schuld : summe
                })
            }else{
                summe += data[i].schulden
            }
        }
        resolve(end)
    })
}

async function sumSD(wgname){
    return new Promise((resolve,reject)=>{
        // need all wg members

        MB.find({wg_name : wgname}, async (error,data)=>{
            if(error){
                reject(error)
            }else if (data.length == 0) {
                reject(`could not find ${wgname}`)
            }else{
                let allMembers = []
                for(i in data){
                    allMembers.push(data[i].mb_name)
                }

                let finished = []
                let errors = []
                for(i in allMembers){
                    await findSD(wgname,allMembers[i])
                        .then(result => {finished.push(result)})
                        .catch(() => finished.push({Bezahler : allMembers[i], Schuldner : []}))
                }
                resolve(finished)
            }
        })
    })
}

async function findSD(wgname,mbname) {
    return new Promise((resolve, reject) => {
        SD.find({ wg_name: wgname, bezahler : mbname}, (error, sdData) => {
            if (error) {
                reject(error)
            } else if (sdData.length == 0) {
                reject(`could not find ${wgname}, or ${mbname}`)
            } else {

                // alle die vom product profitieren in ein array einfuegen mit dem aufgeilten betrag
                let all = []
                for(i in sdData){
                    // Product preis aufteilen
                    let geteilt = sdData[i].profitierer.length + 1
                    let betrag = sdData[i].betrag / geteilt

                    for(x in sdData[i].profitierer){
                        all.push({
                            mb_name : sdData[i].profitierer[x],
                            schulden : betrag
                        })
                    }
                }
                removeDuplicate(all)
                    .then(result => resolve({Bezahler : mbname, Schuldner : result}))
            }
        })
    })
}


async function createSD(wgname, mbname, sdname, bezahler, betrag,profitierer) {
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
                    MB.findOne({ mb_name: bezahler }, async (error, data) => {
                        if (error) {
                            reject(error)
                        } else {
                            if (!data)
                                reject(`could not find ${bezahler}, for ${sdname}`)
                            else {
                                let sd = new SD()
                                sd.uri = mainUri + '/sd/' + wgname + "/" + mbname + "/" + sdname
                                sd.wg_name = wgname
                                sd.sd_name = sdname
                                sd.bezahler = bezahler
                                sd.betrag = betrag
                                sd.profitierer = profitierer || []

                                if (betrag == undefined) {
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
                                            await fetch('https://fake-price-api.herokuapp.com/api/products/' + sdname)
                                                .then(response =>{ return response.json()})
                                                .then(product => {
                                                    let price = parseFloat(product.price.replace(/\$|,/g, ''))
                                                    sd.betrag = (price * rate).toFixed(2)
                                                    sd.save((error)=>{
                                                        if(error){
                                                            reject(error)
                                                        }else{
                                                            resolve(sd)
                                                        }
                                                    })
                                                })
                                                .catch(error =>{
                                                    reject(`api does not have ${sdname}`)
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
    deleteSD: deleteSD,
    sumSD : sumSD
}