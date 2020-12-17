import nodemailer from 'nodemailer';

const mailOptions = {
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '4d4546f4381d35',
    pass: '578018a5625c4f'
  }
};

const transporter = nodemailer.createTransport(mailOptions);

export default transporter;
