const fs = require('fs')
const path = '/../db/data.json'


const getProducts = () =>{
    return new Promise((resolve, reject)=>{
        fs.readFile(__dirname + path , (err,data)=>{
            if(err){
                reject(new Error("could not read file"))
            }
            resolve(JSON.parse(data))
        })
    })
}

const getSpecifigProducts = (product) =>{
    return new Promise((resolve, reject)=>{
        if(path == null){
            reject(new Error("path is missing"))
        }

        fs.readFile(__dirname + path , (err,data)=>{
            if(err){
                reject(new Error("could not read file"))
            }

            const content = JSON.parse(data)
            for(i in content.sortiment){
                if(content.sortiment[i].product== product){
                    resolve(content.sortiment[i])
                }
            }
            reject(new Error("wgname does not exist"))
        })
    })
}

module.exports = {
    getProducts : getProducts,
    getSpecifigProducts : getSpecifigProducts,
}