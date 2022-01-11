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
    schuld: {
        sd_name: String,
        wohlhaber: String,
        summe:Number
    }
})


module.exports =  mongoose.model("Schulden", sdSchema)
