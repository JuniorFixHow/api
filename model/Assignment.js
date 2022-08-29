const mongoose = require( "mongoose");

const AssignmentSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    file:{
        type:String
    },
    text:{
        type:String
    },
    answers:{
        type:[String]
    }
},{timestamps:true} );

const Assignment = mongoose.model("Assignment", AssignmentSchema);
module.exports = Assignment;