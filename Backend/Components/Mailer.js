import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

export class Mailer {
    constructor() {
        dotenv.config();
        this.user = process.env.SENDERMAIL;
        this.pass = process.env.MAILPASS;
        this.from = process.env.MAILFROM;
        this.transporter = null;
    }
    
    // setUp is already called in sentMail method
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
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    // only sentMail method is to be used 
    async sentMail(to, subject, text) {
        await this.setUp();
        try {
            const info = await this.transporter.sendMail({
                from: this.from,
                to: to,
                subject: subject,
                text: text
            })
            return info;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}