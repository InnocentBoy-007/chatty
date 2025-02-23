import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

class Mailer {
    constructor() {
        dotenv.config();
        this.user = process.env.SENDERMAIL;
        this.pass = process.env.MAILPASS;
        this.from = process.env.MAILFROM;
        this.transporter = null;
    }

    // setUp method is to be called in sentMail method
    async setUp() {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: this.user,
                    pass: this.pass
                }
            })
            this.transporter = transporter;
            if (!transporter) {
                const error = new Error("Failed to create transporter");
                throw error;
            }
        } catch (error) {
            console.log(error);
            if (error instanceof Error) {
                console.error(error.message);
            }
        }
    }

    // only sentMail method is to be used 
    async sentMail(to, subject, text) {
        await this.setUp(); // initialize the transporter
        // Check if email was accepted and contains @gmail.com
        const info = await this.transporter.sendMail({
            from: this.from,
            to: to,
            subject: subject,
            text: text
        });

        // Check if email was accepted and contains @gmail.com
        const recipient = info.accepted[0]; // Get the first accepted email
        if (!recipient || !recipient.includes("@gmail.com")) {
            return { error: "Invalid email addresss!" };
        }
        return info;
    }
}

const mailer = new Mailer();
export default mailer;