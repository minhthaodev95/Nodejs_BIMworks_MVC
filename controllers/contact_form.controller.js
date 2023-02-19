const nodemailer = require("nodemailer");

module.exports = {
    postMail: async (req, res, next) => {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.PASS_EMAIL,
                
            },
        });

        const mailOptions = {
            from: `${req.body.name} <${req.body.email}>`,
            to: process.env.EMAIL_ADMIN, 
            subject: req.body.title, 
            text: `Email khách hàng: ${req.body.email}, Có nội dung như sau : ${req.body.content}` 
        };

        await transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                return console.log(err);
            }

            console.log(`messageId: ${info.messageId}`);
            console.log(`envelope: ${info.envelope}`);
            console.log(`accepted: ${info.accepted}`);
            console.log(`rejected: ${info.rejected}`);
            console.log(`pending: ${info.pending}`);
            console.log(`response: ${info.response}`);
        });

        res.redirect(req.get("referer"));
    }
};
