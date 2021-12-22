const test = require('./JsonHelper')

const newWG = {
    uri: "xD" + '/wg/' + "xD",
    name : "xD",
    mitbewohner: [
        
    ]
}

test.addToJson(newWG)

console.log(test.database)

test.deleteFromJson("xD")

console.log(test.database)