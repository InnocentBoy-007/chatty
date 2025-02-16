import UserModel from '../Model/Model.js'
import bcrypt from 'bcrypt'
import { Mailer } from '../Components/Mailer.js';
import Token from '../Components/JWT.js';

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

    async signIn(req, res) {
        const { loginCredentials } = req.body;
        if (!loginCredentials || typeof loginCredentials !== "object") return res.status(401).json({ message: "The request body is either invalid or is not an object!" });

        try {
            // login using either email or phone
            const isValidAccount = await UserModel.findOne({
                $or: [
                    { email: loginCredentials.email },
                    { phone: loginCredentials.phone },
                ]
            }).select("+password");

            if (!isValidAccount?.email || !isValidAccount?.phone) {
                if (!loginCredentials.email) {
                    return res.status(401).json({ message: "Invalid email!" });
                } else {
                    return res.status(401).json({ message: "Invalid phone!" });
                }
            }

            // compare the password
            const isValidPassword = await bcrypt.compare(loginCredentials?.password, isValidAccount?.password);
            if (!isValidPassword) return res.status(409).json({ message: "Incorrect password!" });

            const token = await Token.generateToken({ accountId: isValidAccount._id });

            return res.status(200).json({ message: "Login successful!", token });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An unexpected error ocured while trying to login!" });
        }
    }

}

const services = new Services();
export default services;
