// Module
const WG = require('../../db/wgSchema')
const MB = require('./mbHelper')


const mainUri = 'localhost:3000'

async function findWG(wgname) {
    return new Promise((resolve, reject) => {
        if (wgname == undefined) {
            WG.find({}, (error, data) => {
                resolve(data)
            })
        } else {
            WG.find({ wg_name: wgname }, (error, data) => {
                console.log(data)
                if (error) {
                    reject(error)
                } else if (data.length == 0) {
                    reject(`could not find ${wgname}`)
                } else {
                    resolve(data)
                }
            })
        }
    })
}

async function createWG(wgname) {
    return new Promise((resolve, reject) => {

        let wg = new WG()
        wg.uri = mainUri + '/wg/' + wgname
        wg.wg_name = wgname
        wg.bewohner = []

        wg.save((error) => {
            if (error) {
                reject(error)
            } else {
                resolve(wg)
            }
        })
    })
}

async function updateWG(wgname, newname) {
    return new Promise((resolve, reject) => {

        WG.updateOne({ wg_name: wgname }, {
            $set: {
                wg_name: newname,
                uri: mainUri + '/wg/' + newname
            }
        }, (error, data) => {
            if (error) {
                reject(error)
            }else if(data.matchedCount == 0){
                reject(`could not find ${wgname}`)
            }else {

                // also update all mitbewohner
                MB.updateManyMB(wgname,newname)

                resolve(newname)
            }
        })
    })
}

async function deleteWG(wgname){
    return new Promise((resolve,reject)=>{
        WG.deleteOne({wg_name : wgname}, (error,data)=>{
            if(error){
                reject(error)
            }else if(data.deletedCount == 0){
                reject(`could not find ${wgname}`)
            }else{

            // also delete all mitbewohner
            MB.deleteManyMB(wgname)

            resolve(wgname)
        }
        })
    })
}


module.exports = {
    findWG: findWG,
    createWG: createWG,
    updateWG: updateWG,
    deleteWG : deleteWG,

}