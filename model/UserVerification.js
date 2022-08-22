const mongoose = require( "mongoose");

const UserVerificationSchema = new mongoose.Schema({
    userId: String,
    uniqueString: String,
    createdAt: Date,
    expiresAt:Date
},
    {minimize:false, timestamps:true}
);

const UserVerification = mongoose.model("UserVerification", UserVerificationSchema);

module.exports = UserVerification