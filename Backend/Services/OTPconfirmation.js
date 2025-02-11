import mongoose from "mongoose";
import UserModel from '../Model/Model.js'

export default OTPconfirmation = async(req, res) => {
    const {accountId} = req.params;
    if(!accountId || !mongoose.Types.ObjectId.isValid(accountId)) return res.status(401).json({message: "Invalid account Id!"});

    const {otp} = req.body;
    if(!otp || typeof otp !== "string") return res.status(401).json({message: "Invalid otp!"});

    try {
        const isValidAccount = await UserModel.findById(accountId);
        if(!isValidAccount) return res.status(401).json({message: "Invalid account Id!"});

        // if everything goes wrong in the backend while confirming the otp, remove the cookies in the frontend
        if(Date.now() > isValidAccount?.otpExpiresAt) {
            await isValidAccount.deleteOne();
            return res.status(401).json({message: "OTP has expired! Please request for a new OTP!"});
        } else if(isValidAccount.otp !== isValidAccount?.otp) {
            return res.status(401).json({message: "Invalid OTP!"});
        }

        await isValidAccount.updateOne({otp: undefined, otpExpiresAt: undefined});

        return res.status(200).json({message: "OTP confirmed successfully!"});
    } catch {
        console.error(error);
        return res.status(500).json({message: "An unexpected error ocured while trying to confirm the otp!"});
    }
}