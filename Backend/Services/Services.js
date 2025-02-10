import UserModel from '../Model/Model.js'
import bcrypt from 'bcrypt'
import { Mailer } from '../Components/Mailer.js';

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
            if(!newUser) return res.status(500).json({ message: "Failed to create user!" });

            const otp = Math.floor(100000 + Math.random() * 900000); // 6 digit otp

            /**
             * Send otp to the registered Email
             * If the otp is wrong delete the entire user schema from the database
             */

            const mailBody = {
                to: userDetails?.email,
                subject: "OTP for registration",
                text: `Thanks for singing up in Chatty. Your OTP for registration is: ${otp}. Please use this OTP to complete the registration process.`
            }

            if(!mailBody?.to) {
                await UserModel.deleteOne({ username: userDetails.username });
                return res.status(401).json({ message: "Email is either mising or invalid" });
            } else {
                // needs to configure the node mailer (later)
                const mailer = new Mailer;
                await newUser.updateOne({otp});
                await mailer.sentMail(mailBody.to, mailBody.subject, mailBody.text);
            }

            return res.status(200).json({ message: "OTP sent successfully!" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "An unexpected error ocured while trying to singup!" });
        }
    }

    async login() {

    }

}

const services = new Services();
export default services;
