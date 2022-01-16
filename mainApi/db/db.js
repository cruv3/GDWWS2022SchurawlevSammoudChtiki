const mongoose = require ('mongoose')

const connectDB = async () => {
    try{

        const conn = await mongoose.connect("mongodb+srv://mayess1234:mayess1234@cluster0.lwfcw.mongodb.net/WG?retryWrites=true&w=majority", {
                useNewUrlParser: true, 
                useUnifiedTopology: true,
        })

        console.log('MongoDB Connected: '+ conn.connection.host)
        
    }catch(err){
        console.error(err)
        process.exit(1)
    }
}

module.exports = connectDB