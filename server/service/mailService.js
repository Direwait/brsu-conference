const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

class mailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            }
        });
    }


    async sendResetMail(to, code) {
        await this.transporter.sendMail({
            from: '"Техподдержка БрГУ" <noreply_brsu_test3rjf@mail.ru>',
            to,
            subject: 'Запрос на восстановление пароля',
            text: '',
            html:

                    `<div>
                        <h1>Ваш код ${code}</h1>
                    </div>`
        })
    }
}


module.exports = new mailService();