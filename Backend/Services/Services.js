import UserModel from '../Model/Model.js'
import bcrypt from 'bcrypt'
import { Mailer } from '../Components/Mailer.js';
import Token from '../Components/JWT.js';
import mongoose from 'mongoose';


// need to handle the try-catch block elegantly, especially the throw and catch errors
class Services {
    async signUp(req, res) {
        const { userDetails } = req.body;
        if (!userDetails || typeof userDetails !== 'object') return res.status(401).json({ message: "Invalid request body(userDetails)!" });

        const requiredFields = ["username", "gender", "password", "age", "email"];
        const missingFields = requiredFields.filter(field => !userDetails?.[field]);

        if (missingFields.length > 0) {
            return res.status(401).json({ message: `Missing required fields: ${missingFields.join(", ")}` });
        }

        try {
            const userDuplicate = await UserModel.findOne({ username: userDetails.username });
            if (userDuplicate) {
                if (userDuplicate.username === userDetails.username) return res.status(401).json({ message: "Username already exists!" });

                if (userDuplicate.email === userDetails.email) return res.status(401).json({ message: "Email already exists!" });
            }

            const hashedPassword = await bcrypt.hash(userDetails.password, 10);
            const newUser = await UserModel.create({ ...userDetails, password: hashedPassword });
            if (!newUser) return res.status(500).json({ message: "Failed to create user!" });

            const otp = Math.floor(100000 + Math.random() * 900000); // 6 digit otp
            await newUser.updateOne({ otp, otpExpiresAt: Date.now() + 600000 }); // otp expires in 10 minutes

            /**
             * Send otp to the registered Email
             * If the otp is wrong delete the entire user schema from the database
             */

            const mailBody = {
                to: userDetails?.email,
                subject: "OTP for registration",
                text: `Thanks for singing up in Chatty. Your OTP for registration is: ${otp}. Please use this OTP to complete the registration process.`
            }

            if (!mailBody?.to) {
                await UserModel.deleteOne({ username: userDetails.username });
                return res.status(401).json({ message: "Email is either mising or invalid" });
            } else {
                const mailer = new Mailer();
                await newUser.updateOne({ otp });
                await mailer.sentMail(mailBody.to, mailBody.subject, mailBody.text);
            }

            const token = Token.generateToken({ accountId: newUser._id });

            return res.status(200).json({ message: "OTP sent successfully!", token }); // store the account Id in the cookies as a token
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An unexpected error ocured while trying to singup!" });
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

            return res.status(200).json({ message: `Logout successfully, ${isValidUser?.title}${isValidUser?.username}!` });
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(error.statusCode || 500).json({ message: error.message || "An unexpected error occured while trying to log you out!" });
            }
        }
    }

}

const services = new Services();
export default services;
