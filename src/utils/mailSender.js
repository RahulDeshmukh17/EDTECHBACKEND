const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = transporter.sendMail({
      from: "CarsJagat || All about Cars",
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });
    console.log("info : ", info);
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

moduler.exports = mailSender;
