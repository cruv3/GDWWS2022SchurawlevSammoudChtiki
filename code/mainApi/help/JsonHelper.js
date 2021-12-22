const fs = require('fs')
const database = require('../db/wg.json')
const pathToJson = "./db/wg.json"


const checkIfWGExist = (input) =>{
    database.forEach(db =>{
        if(db.name == input){
            return true
        }else{
            return false
        }
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
        const data = database
        var count = 0
        data.forEach(db=>{
            if(db.name == dataInput){
                const newDB = data.splice(count+1,1)
                fs.writeFileSync("../db/wg.json",JSON.stringify(newDB),'utf-8')
            }
            count ++
        })
    }catch(err){
        console.log(`Error deleting: ${err}`);
    }
}

 

module.exports = {
    checkIfWGExist: checkIfWGExist,
    addToJson: addToJson,
    deleteFromJson: deleteFromJson,
    database: database,
}