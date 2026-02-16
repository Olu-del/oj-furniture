const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { signToken } = require('../utils/jwt');

// Initialise Prisma Client
const prisma = new PrismaClient();

// For sending emails (e.g. welcome email after registration)
const { sendEmail } = require("../utils/email");
const {
  baseTemplate,
  registrationTemplate
} = require("../utils/email.template");

// Controller functions for authentication routes
  exports.register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // 1. Basic validation
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!email.includes("@")) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  //Prevent duplicate emails
  const existing = await prisma.user.findUnique({ where: { email } }); 
  if (existing) { return res.status(400).json({ message: "Email already exists" }); }


  //Hash password
  const hashed = await bcrypt.hash(password, 10);


  //Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashed
      }
    });

    //Send welcome email
    await sendEmail({
      to: user.email,
      subject: "Welcome to OJ Furniture",
      html: baseTemplate(
        registrationTemplate(user.firstName)
  )
});

//Auto-login after registration 
    const token = signToken(user.id); 
    res.cookie("token", token, { 
        httpOnly: true, 
        sameSite: "lax" }); 
    res.json({ message: "Registered and signed in", token }); 
  
 }
exports.signin = async (req, res) => {
const { email, password } = req.body;


const user = await prisma.user.findUnique({ where: { email } });
if (!user) return res.status(401).json({ message: 'Invalid credentials' });


const valid = await bcrypt.compare(password, user.password);
if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

const token = signToken(user.id);


// Store JWT in HTTP‑only cookie
res.cookie('token', token, {
httpOnly: true,
sameSite: 'lax'
});


res.json({ message: 'Signed in', token });
};


exports.signout = (req, res) => {
res.clearCookie('token');
res.json({ message: 'Signed out' });
};