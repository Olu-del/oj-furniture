// contact controller handles contact form submissions
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


// For sending emails (e.g. confirmation after contact form submission)
const { sendEmail } = require("../utils/email");
const {
  baseTemplate,
  contactTemplate
} = require("../utils/email.template");


// Handle contact form submission
async function submitContact(req, res) {
  const { name, email, message } = req.body;

  await prisma.contact.create({
    data: { name, email, message }
  });


  // Email to user
  await sendEmail({
    to: email,
    subject: "We Received Your Message",
    html: baseTemplate(contactTemplate(name))
  });


  // Email to admin
  await sendEmail({
    to: process.env.EMAIL_USER,
    subject: "New Contact Form Submission",
    html: baseTemplate(`
      <h3>New Contact Message</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${message}</p>
    `)
  });

  res.json({ message: "Message sent successfully" });
}


module.exports = {
  submitContact
};
