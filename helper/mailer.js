const nodemailer = require("nodemailer");
require("dotenv").config();
const path = require("path");

const sentMail = (subject, text) => {
  try {
    console.log("sent mail call");
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS,
      },
      from: process.env.EMAIL_ID,
    });

    // console.log({
    //   user: process.env.EMAIL_SERVICE,
    //   pass: process.env.EMAIL_PASS,
    // });
    // await transporter.sendMail({
    //   from: process.env.EMAIL_ID,
    //   to: email,
    //   subject: subject,
    // });
    var mailOptions = {
      from: process.env.EMAIL_ID,
      to: process.env.RECIPIENT_EMAIL_ID,
      cc: "",
      bcc: "",
      attachments: [
        {
          filename: "terminal.png",
          path: path.join(__dirname, "../code.png"),
        },
      ],
      subject: subject,
      text: "over load",

      html: `<p>${text}</p>`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    console.log("email sent successfully");
  } catch (error) {
    console.log(error, "email not sent");
  }
};
module.exports = sentMail;
