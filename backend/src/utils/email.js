// email sender helper using nodemailer
const nodemailer = require("nodemailer");

// Create reusable transporter object using Gmail service
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Function to send an email
async function sendEmail(options) {
  const mailOptions = {
    from: `"OJ Furniture" <£{process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html
  };

  return transporter.sendMail(mailOptions);
}

// Base HTML template for emails
module.exports = {
  sendEmail
};
