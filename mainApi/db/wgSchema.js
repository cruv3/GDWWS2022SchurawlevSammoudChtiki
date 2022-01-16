let mongoose = require('mongoose')

let wgSchema = mongoose.Schema({
    uri : {
        type: String,
        required: true
    },
    wg_name : {
        type: String,
        required: true,
        unique: true,
    }
})


module.exports =  mongoose.model("WG", wgSchema)