import mongoose from "mongoose";

const OTPschema = mongoose.Schema({
    otp: {type: String},
    expiresAt: { type: Date, required: true }, // Use Date type for TTL(Time-To-Live) index
});

// Add a TTL index on the `expiresAt` field
OTPschema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("otp", OTPschema);