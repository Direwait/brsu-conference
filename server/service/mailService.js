const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

class mailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            }
        });
    }


    async sendResetMail(to, code) {
        await this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to,
            subject: 'test mail',
            text: '',
            html:

                    `<div>
                        <h1>your code ${code}</h1>
                    </div>`
        })
    }
}


module.exports = new mailService();