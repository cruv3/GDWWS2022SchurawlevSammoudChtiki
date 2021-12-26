const fs = require('fs')
const database = require('../db/wg.json')
const pathToJson = "../mainApi/db/wg.json"


const checkIfWGExist = (input) =>{
     fs.readFile(pathToJson, (err,data)=>{
        if(err){
            throw err
        }
        const content = JSON.parse(data)
    })
}

const addToJson = (dataInput) =>{
    try{
        const newDB = database
        newDB.push(dataInput)
        const data = JSON.stringify(newDB,null,4)
        fs.writeFileSync("../db/wg.json",data,'utf-8')
    }catch(err){
        console.log(`Error writing file: ${err}`);
    }
}

const deleteFromJson = (dataInput) =>{
    try{
        fs.readFileSync('../db/wg.json', (err,data)=>{
            if(err){
                console.log(`Error reading file: ${err}`)
            }
            const dataRead = JSON.parse(data)
            console.log(dataRead)
            for(let i=0; i<dataRead.length;i++){
                if(dataRead[i].name == dataInput){
                    dataRead.splice(i,1)
                    console.log(dataRead)
                    fs.writeFileSync("../db/wg.json",dataRead,'utf-8')
                    return
                }
            }
            
        })
    }catch(err){
        console.log(`Error deleting: ${err}`);
    }
}

 

module.exports = {
    checkIfWGExist: checkIfWGExist,
    addToJson: addToJson,
    deleteFromJson: deleteFromJson,
    pathToJson: pathToJson,
    database: database,
}