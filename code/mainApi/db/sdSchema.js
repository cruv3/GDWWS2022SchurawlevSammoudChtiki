let mongoose = require('mongoose')

let sdSchema = mongoose.Schema({
    uri : {
        type: String,
        required: true
    },
    wg_name : {
        type: String,
        required: true
    },
    sd_name : {
        type: String,
        required: true
    },
    wohlhaber : {
        type: String,
        required: true
    },
    schuldner : {
        type : Array,
        required : false
    },
    summe : {
        type: String,
        required: false
    }
})


module.exports =  mongoose.model("Schulden", sdSchema)