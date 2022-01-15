const fs = require('fs')
const path = '/../db/data.json'


const getProducts = () =>{
    return new Promise((resolve, reject)=>{
        fs.readFile(__dirname + path , (err,data)=>{
            if(err){
                reject("could not read file")
            }
            resolve(JSON.parse(data))
        })
    })
}

const getSpecifigProducts = (product) =>{
    return new Promise((resolve, reject)=>{
        if(path == null){
            reject("path is missing")
        }

        fs.readFile(__dirname + path , (err,data)=>{
            if(err){
                reject(err)
            }

            const content = JSON.parse(data)

            for(i in content){
                if(content[i].product == product){
                    resolve(content[i])
                }
            }

            reject(`can't find ${product}`)
        })
    })
}

module.exports = {
    getProducts : getProducts,
    getSpecifigProducts : getSpecifigProducts,
}
