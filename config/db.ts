import 'dotenv/config';


const mongoose = require('mongoose')


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string, {
            useNewUrlParser: true,
            useUnifiedTopology: true,

        })
        console.log("mongo connected!")
    }
    
    catch(error){console.log(error)}
}

module.exports = connectDB;
