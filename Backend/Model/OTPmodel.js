import mongoose from "mongoose";

const OTPschema = mongoose.Schema({
    otp: {type: String},
    expiresAt: {type: String},
    accountId: {type: mongoose.Schema.Types.ObjectId, ref: "users"}
})

export default mongoose.model("otp", OTPschema);