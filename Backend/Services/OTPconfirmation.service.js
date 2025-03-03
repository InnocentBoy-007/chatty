import mongoose from "mongoose";
import Token from "../Components/JWT.js";
import OTPmodel from "../Model/OTPmodel.js";
import CustomError from "../Components/CustomError.js";
import UserModel from '../Model/AccountModel.js'

// this needs to be reviewed
const OTPconfirmation = async (req, res, next) => {
    try {
        const { otpID } = req.params;
        if (!otpID || !mongoose.Types.ObjectId.isValid(otpID)) throw new CustomError("Invalid OTP Id!", 401);

        const { otp, accountCredentials } = req.body;

        if (!otp || typeof otp !== "string") throw new CustomError("Invalid OTP!", 401);

        const isValidOTP = await OTPmodel.findById(otpID);
        if (!isValidOTP) throw new CustomError("Invalid otp or otp has expired!", 401);

        if (otp !== isValidOTP.otp) throw new CustomError("Invalid OTP!", 401);

        // if everything goes right, create an account using the user's details
        const newUser = await UserModel.create({ ...accountCredentials });
        if (!newUser) throw new CustomError("An error occured while trying to create your account!", 500);

        await isValidOTP.deleteOne(); // delete the OTP after account creation

        const token = await Token.generateToken({ userID: newUser._id });

        return res.status(201).json({ message: "Account created successfully!", token });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

export default otpConfirmation_service;
