const file = require("./grundlagen_javascript_3")


file.cityFindAndDelete("Berlin")
file.cityFindAndDelete("Hamburg")

file.addCity("Gummersbach", 50000,"NRW")

file.readJSON(file.jsonPath, (error,result)=>{
    try{
        let data = JSON.parse(result)
        console.log(data)
        return
    }catch(error){
        console.log(error)
        return
    }
})