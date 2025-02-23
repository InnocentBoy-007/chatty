import UserModel from '../Model/AccountModel.js'
import OTPModel from '../Model/OTPmodel.js'
import bcrypt from 'bcrypt'
import mailer from '../Components/Mailer.js';
import Token from '../Components/JWT.js';
import mongoose from 'mongoose';
import ThrowError from '../Components/ErrorHandler.js';

// need to handle the try-catch block elegantly, especially the throw and catch errors
class Services {
    // signUp method's code is well optimised
    async signUp(req, res, next) {
        try {
            const { userDetails } = req.body;
            if (!userDetails || typeof userDetails !== 'object') {
                ThrowError("Invalid request body(userDetails)!", 401);
            }

            if(userDetails?.phone.length !== 10) ThrowError("Invalid phone number!", 401); // phone number should be 10 digits (validator)

            const requiredFields = ["username", "gender", "password", "age", "email", "phone"];
            const missingFields = requiredFields.filter(field => !userDetails?.[field]); // it returns an array

            if (missingFields.length > 0) {
                ThrowError(`Missing required fields: ${missingFields.join(", ")}`, 401);
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
                ThrowError(`${duplicateField} is already taken!`, 401);
            }

            const newUser = await UserModel.create({ ...userDetails, password: await bcrypt.hash(userDetails.password, 10) });
            if (!newUser) ThrowError("Failed to create user!", 500);

            const otp = Math.floor(100000 + Math.random() * 900000); // 6 digit password
            await OTPModel.create({ otp, expiresAt: Date.now() + 600000 }); 
            /**
             * Send otp to the registered Email
             * If the otp is wrong delete the entire user schema from the database
             */

            const mailBody = {
                to: userDetails?.email,
                subject: "OTP for registration",
                text: `Thanks for singing up in Chatty. Your OTP for registration is: ${otp}. Please use this OTP to complete the registration process.`
            }

            const mailerResponse = await mailer.sentMail(mailBody.to, mailBody.subject, mailBody.text);
            if (mailerResponse.error) { // if the mailerResponse has an error
                await newUser.deleteOne(); // delete the user schema from the database
                await OTPModel.deleteOne(); // delete the otp schema from the database
                ThrowError(mailerResponse.error, 500);
            }

            return res.status(200).json({ message: `OTP is sent to ${newUser.email}`, token: await Token.generateToken({ accountId: newUser._id }) }); // store the account Id in the cookies as a token
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return next(error);
            }
        }
    }

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

            // I think this validation part is unnecessary since, it is already done in frontend
            if (!isValidAccount?.email || !isValidAccount?.phone) {
                if (!loginCredentials.email) {
                    return res.status(401).json({ message: "Invalid email!" });
                } else {
                    return res.status(401).json({ message: "Invalid phone!" });
                }
            }

            // compare the password
            const isValidPassword = await bcrypt.compare(password, isValidAccount?.password);
            if (!isValidPassword) return res.status(403).json({ message: "Incorrect password!" });

            const token = await Token.generateToken({ accountId: isValidAccount._id });

            return res.status(200).json({ message: "Login successful!", token });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An unexpected error ocured while trying to login!" });
        }
    }

    async logout(req, res) {
        const isValidAccountId = req.accountId;
        if (!isValidAccountId || !mongoose.Types.ObjectId.isValid(isValidAccountId)) return res.status(401).json({ message: "Invalid account Id!" });
        try {
            const isValidUser = await UserModel.findById(isValidAccountId);
            if (!isValidUser) return res.status(404).json({ message: "User not found!" });

            return res.status(200).json({ message: `Logout successfully, ${isValidUser?.title}${isValidUser?.username}!` });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An unexpected error occured while trying to logout!" });
        }
    }

}

const services = new Services();
export default services;
