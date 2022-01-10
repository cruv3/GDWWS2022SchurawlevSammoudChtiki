let mongoose = require('mongoose')

let mbSchema = mongoose.Schema({
    uri : {
        type: String,
        required: true
    },
    wg_name : {
        type: String,
        required: true
    },
    mb_name : {
        type: String,
        required: true,
        unique: true
    },
    schulden: {
        type: Array,
        required:true,
    }
})


module.exports =  mongoose.model("BEWOHNER", mbSchema)
