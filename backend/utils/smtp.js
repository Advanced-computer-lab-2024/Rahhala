import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config({ path: "../../.env" }); // Adjust path if needed


const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io', // Ensure this matches Mailtrap's SMTP host
  port: 587,              // Port must match the allowed port in your firewall rules
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});
console.log(process.env.MAILTRAP_USER);
console.log(process.env.MAILTRAP_PASS);
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('SMTP Connection Successful:', success);
  }
});
