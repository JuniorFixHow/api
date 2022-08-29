const mongoose = require( "mongoose");

const SolutionSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },

    file:{
        type:String
    },

    desc:{
        type:String
    },
    price:{
        type:Number,
        required: true
    }
},{timestamps:true} );

const Solution = mongoose.model("Solution", SolutionSchema);
module.exports = Solution;