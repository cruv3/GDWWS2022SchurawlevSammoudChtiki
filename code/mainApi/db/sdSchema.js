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
    bezahler : {
        type: String,
        required: true
    },
    betrag : {
        type: String,
        required: false
    },
    profitierer : {
        type : Array,
        required : false
    }
})


module.exports =  mongoose.model("Schulden", sdSchema)
