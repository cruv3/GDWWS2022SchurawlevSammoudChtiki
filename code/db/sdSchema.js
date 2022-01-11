let mongoose = require('mongoose')

let sdSchema = mongoose.Schema({
    uri : {
        type: String,
        required: true
    },
    mb_name : {
        type: String,
        required: true,
        uniquie: true
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
    summe : {
        type: String,
        required: false
    }
})


module.exports =  mongoose.model("Schulden", sdSchema)
