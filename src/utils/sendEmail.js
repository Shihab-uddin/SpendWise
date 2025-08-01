import nodemailer from "nodemailer";

export const sendEmail = async (email, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // or use SMTP config
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};
