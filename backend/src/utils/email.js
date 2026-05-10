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

// prepare and send an email message
async function sendEmail(options) {
  const mailOptions = {
    from: `"OJ Furniture" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html
  };

  try {
    return await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Email sending failed:", err);
    throw new Error("Email could not be sent");
  }
}

// Export
module.exports = {
  sendEmail
};
