require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, 
    secure: true,
    auth: {
        user: process.env.NODE_USER,
        pass: process.env.NODE_PASS
    }
});

module.exports = transporter;
