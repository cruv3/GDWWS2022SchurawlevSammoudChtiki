const fs = require("fs")



async function findCityByName(name) {
    let obj = {}
    try {
        await fs.readFile("cities.json", (err, data) => {
            if (err) throw (err)
            obj = JSON.parse(data)
            obj.forEach(element => {
                if (element.stadt == name)
                    console.log(element)
            });
        })
    } catch (err) {
        console.log(err)
    }
}
function deleteCity(name) {
    let obj = {}
    let obj2 = []
    try {
        fs.readFile("cities.json", (err, data) => {
            if (err) throw (err)
            obj = JSON.parse(data)
            obj.forEach(element => {
                if (element.Stadt != name)
                    obj2.push(element)
            });
            data2 = JSON.stringify(obj2)
            fs.writeFile("cities.json", data2, err => {
                if (err) {
                    console.error(err)
                    return
                }
                //file written successfully
            })
        })
    } catch (err) {
        console.log(err)
    }
}
async function displayUserCity() {
    let obj = {}
    try {
        await fs.readFile("user.json", (err, data) => {
            if (err) throw (err)
            obj = JSON.parse(data)
            obj.forEach(element => {
                console.log(element)
                findCityByName(element.wohnort)

            });
        })
    } catch (err) {
        console.log(err)
    }
}

findCityByName("Dortmund")
displayUserCity()