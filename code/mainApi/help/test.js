const test = require('./wgHelper')

const newWG = {
    uri: "xD" + '/wg/' + "xD",
    name : "xD",
    mitbewohner: []
}

test.checkIfWGExist("xD").then(function(result){
    if(result){
        return "Exists"
    }
    
    test.addToJson(newWG)
})


