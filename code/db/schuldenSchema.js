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
    schulden:{
        
    }
})


module.exports =  mongoose.model("Schulden", sdSchema)
