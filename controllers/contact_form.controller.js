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
          // send mail with defined transport object
         transporter.sendMail({
            from: ` ${req.body.name} < ${req.body.email} > `,
            to: process.env.EMAIL_ADMIN, // list of receivers
            subject: `${req.body.title}`, // Subject line
           text: `
            Email khách hàng : ${req.body.email}, 
            Có nội dung như sau :  ${req.body.content}`, // plain text body
            // html: "<b>Hello world?</b>", // html body
          }, (err, info) => {
            if (err)  {
              return console.log(err)
            }
              console.log("info.messageId: " + info.messageId);
              console.log("info.envelope: " + info.envelope);
              console.log("info.accepted: " + info.accepted);
              console.log("info.rejected: " + info.rejected);
              console.log("info.pending: " + info.pending);
              console.log("info.response: " + info.response);
          });
         
          res.redirect(req.get('referer'));
    }
}