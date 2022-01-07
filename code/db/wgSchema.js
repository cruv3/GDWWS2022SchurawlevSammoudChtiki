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
    },
    bewohner : {
        type: Array,
        required: true
    }
})


module.exports =  mongoose.model("WG", wgSchema)