// Aufgabe 3

var nameX = "Andreas Schurawlev"
console.log(nameX)


// Aufgabe 3.1

// cities.json -> quelle : https://www.dw.com/de/top-ten-deutschlands-größte-städte/g-52352707


// Aufgabe 3.2

const fs = require('fs')

const jsonPath = './cities.json'

const readJSON = (pfad,callback) => {
    try{
    fs.readFile(pfad, 'utf8', (err,result)=> {
        if(err)
            callback(err)
            else
            callback(null,result)
    })}catch(error){
        console.log(error)
    }
}


function cityFindAndDelete(cityName){
    readJSON(jsonPath, (error,result)=>{
        if(error){
            console.log(error)
            return
        }
        cities = JSON.parse(result)
        for(let i = 0; i < cities.length; i++){
            if(cities[i].name == cityName){
                cities.splice(i,1)
                break
            }
        }

        fs.writeFile(jsonPath, JSON.stringify(cities,null,2),error =>{
            if (error) {
                console.log(error)
                return
            }

            console.log('Successfully deleted ' + cityName)
            return
        })
    })
}

function addCity(cityName, population, state){
    readJSON(jsonPath, (error,result)=>{
        if(error){
            console.log(error)
            return
        }

        cities = JSON.parse(result)

        let newCity = {
            "name": cityName,
            "rank":cities.length,
            "einwohnerzahl":population,
            "bundesland": state
        }

        cities.push(newCity)

        fs.writeFile(jsonPath, JSON.stringify(cities,null,2),error =>{
            if (error) {
                console.log(error)
                return
            }

            console.log('Successfully added ' + cityName)
            return
        })
    })
}

module.exports = {
    jsonPath,
    readJSON,
    addCity,
    cityFindAndDelete
}