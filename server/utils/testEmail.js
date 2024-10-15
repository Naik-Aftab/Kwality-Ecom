const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'aftabnaik1999@gmail.com',
    pass: 'zrlr qmri ofao akie'
  },
  tls: {
    rejectUnauthorized: false
  }
});

const mailOptions = {
  from: 'Kwality Ecom <aftabnaik1999@gmail.com>',
  to: 'aftabnaik1999@gmail.com',
  subject: 'Testing Nodemailer',
  text: 'This is a test email from Nodemailer!'
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log('Error:', error);
  }
  console.log('Email sent:', info.response);
});
