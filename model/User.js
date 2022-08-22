const mongoose= require( "mongoose");

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        unique: true,
        required: true
    },
    email:{
        type:String,
        unique: true,
        required: true
    },
    password:{
        type:String,
        required: true,
    },
    phone:{
        type:String
    },
    isAdmin:{
        type:Boolean,
        default: false
    },
    verified:{
        type:Boolean,
        default: false
    },
    photo:{
        type:String,
        default: "https://www.seekpng.com/png/full/73-730482_existing-user-default-avatar.png"
    },
    assignments:{
        type:[String]
    },
},{timestamps:true})

const User = mongoose.model("User", UserSchema);
module.exports = User;