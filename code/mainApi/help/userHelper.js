const fs = require('fs')
const products = require('../../fakeApi/resources/products')

const getUser = (path, wgID) =>{
    return new Promise((resolve, reject)=>{
        if(path == null){
            reject(new Error("path is missing"))
        }

        fs.readFile(path, (err,data)=>{
            if(err){
                reject(new Error("could not read file"))
            }

            content = JSON.parse(data)

            for(i in content){
                if(content[i].name == wgID){
                    resolve(content[i].mitbewohner)
                }
            }

            reject(new Error({error : "could not find wg"}))
        })
    })
}


const addUser = (path, wgID, newUser) =>{
    return new Promise((resolve, reject)=>{
        fs.readFile(path,(err, data)=>{
            if(err){
                reject(new Error("could not read file"))
            }

            content = JSON.parse(data)

            for(i in content){
                if(content[i].name == wgID){

                    const newMitbewohner = content[i].mitbewohner
            
                    newMitbewohner.push(newUser)

                    

                    const changedWG = {
                        uri : content[i].uri,
                        name : content[i].name,
                        mitbewohner : newMitbewohner
                    }

                    addSchuldenToObject(newMitbewohner).then((ans)=> {console.log(ans)})

                    fs.writeFile(path, JSON.stringify(content, null, 4), (err)=>{
                        if (err){
                            throw(error)
                        }
                    })
                    resolve(changedWG)
                }
            }
        })
    })
}

const deleteUser = (path, wgID, mbID) =>{
    return new Promise((resolve,reject)=>{
        fs.readFile(path,(err, data)=>{
            if(err){
                throw err
            }

            const content = JSON.parse(data)
            

            for(i in content){
                if(content[i].name == wgID){
                    var wgFound = content[i]
                    for(x in wgFound.mitbewohner){
                        if(wgFound.mitbewohner[x].name == mbID){
                            const beforeChange = wgFound.mitbewohner
                            beforeChange.splice(x,1)

                            const changedWG = {
                                uri : wgFound.uri,
                                name : wgFound.name,
                                mitbewohner : beforeChange
                            }
                            addSchuldenToObject(beforeChange)
                            fs.writeFile(path, JSON.stringify(content, null, 4), (err)=>{
                                if (err){
                                    throw(error)
                                }
                            })
                            resolve(changedWG)
                        }
                    }
                }
            }
            reject(new Error("could not find"))
        })
    })
}

const changeUser = (path, wgID, mbID, changedUser) =>{
    return new Promise((resolve, reject)=>{
        fs.readFile(path,(err, data)=>{
            if(err){
                throw err
            }

            const content = JSON.parse(data)

            // search wg
            for(i in content){
                if(content[i].name == wgID){
                    var wgFound = content[i]

                    // search mitbewohner
                    for(x in wgFound.mitbewohner){
                        if(wgFound.mitbewohner[x].name == mbID){

                            const beforeChange = wgFound.mitbewohner

                            const change = {
                                name : changedUser.name || wgFound.mitbewohner.name,
                                schulden : changedUser.schulden || wgFound.mitbewohner.schulden
                            }

                            beforeChange.splice(x,1)
                            beforeChange.push(change)

                            const changedWG = {
                                uri : wgFound.uri,
                                name : wgFound.name,
                                mitbewohner : beforeChange
                            }

                            content.splice(i,1)
                            content.push(changedWG)
                            addSchuldenToObject
                            fs.writeFile(path, JSON.stringify(content, null, 4), (err)=>{
                                if (err){
                                    throw(error)
                                }
                            })
                            
                            resolve(change)
                        }
                    }
                    reject(new Error("could not find"))
                }
            }
        })
    })
}

const getSchulden = (path, wgID, mbID) =>{
    return new Promise ((resolve, reject)=>{
        fs.readFile(path,(err, data)=>{
            if(err){
                throw err
            }

            const content = JSON.parse(data)

            for(i in content){
                if(content[i].name == wgID){
                    var wgFound = content[i]
                    for(x in wgFound.mitbewohner){
                        if(wgFound.mitbewohner[x].name == mbID){
                            resolve(wgFound.mitbewohner[x].schulden)
                        }
                    }
                }
            }
            reject(new Error("could not find"))
        })
    })
}


const addSchulden = (path, wgID,mbID,schulden) =>{
    return new Promise((resolve, reject)=>{
        fs.readFile(path,(err, data)=>{
            if(err){
                throw err
            }

            const content = JSON.parse(data)
            for(i in content){
                if(content[i].name == wgID){
                    var wgFound = content[i]
                    for(x in wgFound.mitbewohner){
                        if(wgFound.mitbewohner[x].name == mbID){
                            
                            var beforeChange = wgFound.mitbewohner.schulden
                            addSchuldenToObject(wgFound.mitbewohner)

                            const change = {
                                name : wgFound.mitbewohner.name,
                                schulden : beforeChange
                            }

                            const changedWG = {
                                uri : wgFound.uri,
                                name : wgFound.name,
                                mitbewohner : change
                            }
                            content.splice(i,1)
                            content.push(changedWG)

                            fs.writeFile(path, JSON.stringify(content, null, 4), (err)=>{
                                if (err){
                                    throw(error)
                                }
                            })
                            resolve(change)
                        }
                    }
                }
            }
            reject(new Error("could not find"))
        })
    })
}

const addSchuldenToObject = (mitbewohnerlist) =>{
    return new Promise ((resolve, reject)=>{
        var schuldenlist = []

        // saves all mitbewohner in an array
        for(i in mitbewohnerlist){
            schuldenlist.push(mitbewohnerlist[i].name)
        } 

        // goes trough array
        for(i in schuldenlist){
            // goes trough memberlist
            for(x in mitbewohnerlist){
                // adds the member to schulden only if its not himself
                if(schuldenlist[i] != mitbewohnerlist[x].name){
                    
                    // wird doppel eingefuegt
                    const test = schuldenlist[i]

                    const schuld = {
                        [test] : 0
                    }
                    mitbewohnerlist[x].schulden.push(schuld)
                }
            }
        }
        resolve(mitbewohnerlist)
    })
}


module.exports = {
    getUser : getUser,
    addUser : addUser,
    changeUser : changeUser,
    deleteUser : deleteUser,
    getSchulden : getSchulden,
    addSchulden : addSchulden,
}
    