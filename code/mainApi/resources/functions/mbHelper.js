// module
const MB = require('../../db/mbSchema')
const WG = require('../../db/wgSchema')

const mainUri = 'localhost:3000'

async function findMB(wgname) {
    return new Promise((resolve, reject) => {
        if (wgname == undefined) {
            MB.find({}, (error, data) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(data)
                }
            })
        } else {
            MB.find({ wg_name: wgname }, (error, data) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(data)
                }
            })
        }
    })
}

async function createMB(wgname, body) {
    return new Promise((resolve, reject) => {

        // check if wg exists
        WG.find({ wg_name: wgname }, (error, data) => {
            if (error) {
                reject(error)
            } else if (data.length == 0) {
                reject(`could not find ${wgname}`)
            } else {
                // if exists create mb
                for(i in body){
                    let mb = new MB()
                    mb.uri = mainUri + '/mitbewohner/' + body[i].wg_name + "/" + body[i].mb_name
                    mb.wg_name = wgname
                    mb.mb_name = body[i].mb_name
                    mb.schulden = []

                    mb.save((error) => {
                        if (error) {
                            reject(error)
                        }
                    })
                }

                resolve(body)
            }
        })
    })
}

async function deleteMB(wgname, mbname) {
    return new Promise((resolve, reject) => {
        MB.deleteOne({ wg_name: wgname, mb_name: mbname }, (error, data) => {
            if (error) {
                reject(error)
            } else if (data.deletedCount == 0) {
                reject(`could not find ${wgname} or ${mbname}`)
            } else {
                resolve(mbname)
            }
        })
    })
}

async function deleteManyMB(wgname) {
    return new Promise((resolve, reject) => {
        MB.deleteMany({ wg_name: wgname }, (error) => {
            if (error) {
                reject(error)
            }
        })
    })

}

async function updateMB(wgname, mbname, newname) {
    return new Promise((resolve, reject) => {
        MB.findOneAndUpdate({ wg_name: wgname, mb_name: mbname }, {
            $set: {
                mb_name: newname,
                uri: mainUri + '/mitbewohner/' + wgname + "/" + newname
            }
        }, (error, data) => {
            if (error) {
                reject(error)
            } if (!data) {
                reject(`could not find ${wgname} or ${mbname}`)
            } else {
                resolve(newname)
            }
        })
    })
}

// uri veraendert sich nicht
async function updateManyMB(wgname, newname) {
    return new Promise((resolve, reject) => {
        MB.updateMany({ wg_name: wgname }, {
            $set: {
                wg_name: newname
            }
        }, (error) => {
            if (error) {
                reject(error)
            }
        })
    })
}

module.exports = {
    createMB: createMB,
    deleteMB: deleteMB,
    deleteManyMB: deleteManyMB,
    updateMB: updateMB,
    updateManyMB: updateManyMB,
    findMB: findMB,
}