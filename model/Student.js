const mongoose = require( "mongoose");

const StudentSchema = new mongoose.Schema({
    surname:{
        type:String,
        required:true
    },
    othernames:{
        type:String,
        required: true
    },
    address:{
        type:String,
        required: true
    }

}, {timestamps:true})

const Student = mongoose.model("Student", StudentSchema);
module.exports = Student;