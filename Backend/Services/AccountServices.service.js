import UserModel from '../Model/AccountModel.model.js'
import OTPModel from '../Model/OTPmodel.model.js'
import bcrypt from 'bcrypt'
import mailer from '../Components/Mailer.js';
import Token from '../Components/JWT.js';
import mongoose from 'mongoose';
import CustomError from '../Components/CustomError.js';

// need to handle the try-catch block elegantly, especially the throw and catch errors
// use jwt to temporarily manage the user credentials before they are actually stored in the database
class Services {
    // signUp method's code is well optimised

    // parse the incoming password
    async signUp(req, res, next) {
        try {
            const { userDetails } = req.body;
            if (!userDetails || typeof userDetails !== 'object') {
                throw new CustomError("Invalid user details!", 401);
            }

            if (userDetails?.phoneNo.length !== 10) throw new CustomError("Invalid phone number!", 401); // phone number should be 10 digits (validator)

            const requiredFields = ["username", "gender", "password", "age", "email", "phoneNo"];
            const missingFields = requiredFields.filter(field => !userDetails?.[field]); // it returns an array

            if (missingFields.length > 0) {
                throw new CustomError(`Missing required fields: ${missingFields.join(", ")}`, 401);
            }

            const isUserDuplicate = await UserModel.findOne({
                $or: [
                    { username: userDetails.username },
                    { email: userDetails.email },
                    { phone: userDetails.phone }
                ]
            });

            const inputFields = ["username", "email", "phone"]; // fields that are required to be unique
            if (isUserDuplicate) {
                const duplicateField = inputFields.find(field => userDetails[field] === isUserDuplicate[field]); // find() returns the first matching element/ the first element that specifies the condition
                throw new CustomError(`${duplicateField} is already taken!`, 401);
            }

            const otp = Math.floor(100000 + Math.random() * 900000); // 6 digit otp
            const newOTP = await OTPModel.create(
                { otp, expiresAt: new Date(Date.now() + 60000) } // otp expires at 1 mins
            );
            if (!newOTP) throw new CustomError("Failed to create OTP!", 500);

            const mailBody = {
                to: userDetails?.email,
                subject: "OTP for registration",
                text: `Thanks for singing up in Chatty. Your OTP for registration is: ${otp}. Please use this OTP to complete the registration process.`
            }

            const mailerResponse = await mailer.sentMail(mailBody.to, mailBody.subject, mailBody.text);
            if (mailerResponse.error) {
                await OTPModel.deleteOne(); // delete the otp schema from the database
                throw new CustomError(mailerResponse.error, 500);
            }

            userDetails.password = await bcrypt.hash(userDetails.password, 10); // hash the password

            // send the account credentials as JWT but not the otpID, just fckng return the otpID as an object
            return res.status(200).json(
                {
                    message: `OTP is sent to ${userDetails.email}`,
                    token: await Token.generateToken({ userDetails }), // send the account credentials along with the OTP Id to the frontend in JWT format
                    otpID: newOTP._id
                }
            );
        } catch (error) {
            console.error(error);
            next(error); // pass the error to the error handler middleware (global error handler)
        }
    }

    // optimized codes
    async signIn(req, res) {
        const { email, phoneNo, password } = req.body?.loginCredentials ?? {};

        try {
            // login using either email or phone
            const isValidAccount = await UserModel.findOne({
                $or: [
                    { email },
                    { phone: phoneNo },
                ]
            }).select("+password");

            if (!isValidAccount) {
                const error = new Error(email ? 'There is no account with this email!' : 'This is no account with this phone number!');
                error.statusCode = 404;
                throw error;
            }

            // compare the password
            const isValidPassword = await bcrypt.compare(password, isValidAccount?.password);
            if (!isValidPassword) {
                const error = new Error("Incorrect password!");
                error.statusCode = 409;
                throw error;
            }

            const token = await Token.generateToken({ accountId: isValidAccount._id });

            return res.status(200).json({ message: "Login successful!", token });
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(error.statusCode || 500).json({ message: error.message || "An unexpected error occured while trying to log you in!" });
            }
        }
    }

    // optimized codes
    async logout(req, res) {
        const isValidAccountId = req.accountId; // coming from the authentication middleware
        try {
            // validator
            if (!isValidAccountId || !mongoose.Types.ObjectId.isValid(isValidAccountId)) {
                const error = new Error("Invalid account Id!");
                error.statusCode = 401;
                throw error;
            }

            const isValidUser = await UserModel.findById(isValidAccountId);
            if (!isValidUser) {
                const error = new Error("User not found!");
                error.statusCode(404);
                throw error;
            }

            res.cookie("jwt", "", {maxAge: 0}); // this removes the cookie

            return res.status(200).json({ message: `Logout successfully, ${isValidUser?.title}${isValidUser?.username}!` });
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(error.statusCode || 500).json({ message: error.message || "An unexpected error occured while trying to log you out!" });
            }
        }
    }

    async updateDP(req, res) {
        // to update profile pic
    }

}

const services = new Services();
export default account_service;
