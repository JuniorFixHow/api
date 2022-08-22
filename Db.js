const mongoose = require( "mongoose");
const dotenv =  require ( 'dotenv');

dotenv.config();

const ConnectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO)
            .then(()=>{
                console.log("Mongo Connected Successfully");
            })
    } catch (err) {
        console.log(err);
    }
}
module.exports = ConnectDB;