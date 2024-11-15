import nodemailer from "nodemailer";
import config from "../../../config";

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: config.sendEmail.email,
      pass: config.sendEmail.app_pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: '"PH Health Care 👻" <gandibroy11@gmail.com>', // sender address
    to, // list of receivers
    subject: "Reset your password within ten minutes!", // Subject line
    text: "Hi! Reset your password!", // plain text body
    html, // html body
  });

  //   console.log("Message sent: %s", info.messageId);
};
