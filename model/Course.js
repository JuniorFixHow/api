const mongoose = require( "mongoose");

const CourseSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    courseCode:{
        type:String
    },
    desc:{
        type:String
    },
    resources:{
        type:[String]
    },
    price:{
        type:Number
    },
    students:{
        type:[String]
    }
}, {timestamps:true})

const Course = mongoose.model("Course", CourseSchema);
module.exports= Course;