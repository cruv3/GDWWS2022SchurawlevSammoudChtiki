const fs = require('fs')

const getData = (path) =>{
    return new Promise((resolve, reject)=>{
        if(path == null){
            reject(new Error("path is missing"))
        }

        fs.readFile(path, (err,data)=>{
            if(err){
                reject(new Error("could not read file"))
            }
            resolve(JSON.parse(data))
    })
    })
}

const getSpecificWg = (path,wgName) =>{
    return new Promise((resolve, reject)=>{
        if(path == null || wgName == null){
            reject(new Error("path/wgName is missing"))
        }

        fs.readFile(path, (err,data)=>{
            if(err){
                throw err
            }
            const content = JSON.parse(data)

            for(i in content){
                if(content[i].name == wgName){
                    resolve(content[i])
                }
            }
            reject(new Error("wgname does not exist"))
        })
    })
}

const checkIfWGExist = (path, wgName) =>{
    return new Promise((resolve, reject)=>{
        if(path == null || wgName == null){
            reject(new Error("path/wgName is missing"))
        }

        fs.readFile(path, (err,data)=>{
            if(err){
                throw err
            }
            const content = JSON.parse(data)

            for(i in content){
                if(content[i].name == wgName){
                    resolve(true)
                }
            }
            resolve(false)
        })
    })
}

const addToJson = (path, newWG) =>{
    return new Promise((resolve, reject)=>{
        if(path == null || newWG == null){
            reject(new Error("path/newWG is missing"))
        }

        fs.readFile(path,(err,data)=>{
            if(err){
                throw err
            }
            const content = JSON.parse(data)
            content.push(newWG)

            fs.writeFile(path, JSON.stringify(content, null, 4), (err)=>{
                if (err){
                    resolve(false)
                }
                resolve(true)
            })
        })
    })
}

const deleteWG = (path, deleteWG) =>{
    return new Promise((resolve, reject)=>{
        if(path == null || deleteWG == null){
            reject(new Error("path/deleteWG is missing"))
        }

        var changed = false

        fs.readFile(path,(err,data)=>{
            if(err){
                throw err
            }
            const content = JSON.parse(data)

            // search for name
            for(let i= 0; i< content.length; i++){
                if((content[i].name).toUpperCase() == deleteWG.toUpperCase()){
                    content.splice(i,1)
                    fs.writeFile(path, JSON.stringify(content, null, 4), (err)=>{
                        if (err){
                            throw(error)
                        }
                    })
                    changed = true
                }
            }
            if(changed){
                resolve(true)
            }else{
                resolve(false) 
            }
        })
    })
}

const changeWG = (path, search, change) =>{
    return new Promise((resolve, reject)=>{
        fs.readFile(path,(err, data)=>{
            if(err){
                throw err
            }
            const content = JSON.parse(data)
            var changed = false

            for(let i= 0; i< content.length; i++){
                if(content[i].name == search){{

                    // rest wird uebernommen sollte change. undefinded sein
                    const changedWG = {
                        uri : change.uri || content[i].uri,
                        name : change.name || content[i].name,
                        mitbewohner : change.mitbewohner || content[i].mitbewohner
                    }
                    content.splice(i,1)
                    content.push(changedWG)
            
                    fs.writeFile(path, JSON.stringify(content, null, 4), (err)=>{
                        if (err){
                            throw(error)
                        }
                    })
                    changed = true
                }}
            }
            if(changed){
                resolve(true)
            }else{
                resolve(false) 
            }
        })
    })
}

 

module.exports = {
    getData : getData,
    checkIfWGExist : checkIfWGExist,
    addToJson : addToJson,
    deleteWG : deleteWG,
    changeWG : changeWG,
    getSpecificWg : getSpecificWg,
}