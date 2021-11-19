// Aufgabe 3

var nameX = "Andreas Schurawlev"
console.log(nameX)


// Aufgabe 3.1

// cities.json -> quelle : https://www.dw.com/de/top-ten-deutschlands-größte-städte/g-52352707


// Aufgabe 3.2

const fs = require('fs')
const jsonCitiesPath = './cities.json'
const jsonUserPath = './user.json'

const readJSON = ( path) => {
    try {
        const jsonString = fs.readFileSync(path)
        const dataRead = JSON.parse(jsonString)
        return dataRead    
    }catch ( error ){
        console.log( error )
        process.exit()
    }
}

const writeJSON = (path, data) =>{
    try{
        fs.writeFileSync(path,JSON.stringify(data, null, 2), error =>{
            if(error){
                console.log(error)
                return
            }
        })
    }catch(error){
        console.log(error)
        process.exit()
    }
}


const cityFindAndDelete = (cityName, jsonArray) =>{
    // check if jsonArray is acutally an array and not undefined
    if(undefined !== jsonArray && jsonArray.length){
        for(let i = 0; i < jsonArray.length; i++){
            if(jsonArray[i].name == cityName){
                jsonArray.splice(i,1)
                writeJSON('./cities.json',jsonArray)
                break
            }else{
                console.log("No City with this Name could be found")
                return
            }
        }
    }else{
        console.log("Input is not an array or undefined")
        return
    }

}

const addCity = (cityName, population, state) =>{
    
    let cities = readJSON(jsonCitiesPath)

    let newCity = {
        "name": cityName,
        "rank": cities.length + 1,
        "einwohnerzahl":population,
        "bundesland": state
    }

    cities.push(newCity)

    writeJSON(jsonCitiesPath,cities)  
}


// module.exports -> these functions can be used in other files
module.exports = {
    jsonPath: jsonCitiesPath,
    readJSON,
    addCity,
    cityFindAndDelete,
    connect
}

// Aufgabe 3.4

async function connect(){
    let userPromise = new Promise(function(resolve, reject){

        let users = readJSON('./user.json')
        if(users == null){
            reject("error")
        }

        resolve(users)
    })

    let citiesPromise = new Promise(function(resolve, reject){
        let cities = readJSON('./cities.json')

        if(cities == null){
            reject("error")
        }

        resolve(cities)
    })

    let parseUser = await userPromise
    let parseCities = await citiesPromise

    let newConnectedArray = []

    for(let i = 0; i < parseUser.length; i++){
        for(let x = 0; x < parseCities.length; x++){


            if(parseUser[i].wohnort == parseCities[x].name){
                // add to object

                var newCombined = {
                    einwohner: parseCities[x].einwohner,
                    bundesland : parseCities[x].bundesland,
                    vorname : parseUser[i].vorname,
                    nachname : parseUser[i].nachname,
                    email : parseUser[i].email,
                    wohnort : parseUser[i].wohnort
                }
                newConnectedArray.push(newCombined)
            }
        }
    }

    for(let i=0;i<newConnectedArray.length;i++){
        console.log(newConnectedArray[i]);
    }
}