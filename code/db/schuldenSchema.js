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
    schulden:{
        type: Object,
        required: true 
    }
})


module.exports =  mongoose.model("Schulden", sdSchema)
