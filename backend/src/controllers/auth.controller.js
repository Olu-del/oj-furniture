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



// User registration controller
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, line1, city, postcode, country } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !password || !line1 || !city || !postcode || !country) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!email.includes("@")) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Prevent duplicate emails
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email is already registered. Please sign in instead." });
    }


    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user + address
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        address: {
          create: { line1, city, postcode, country }
        }
      }
    });


    // Send welcome email
    try {
      await sendEmail({
        to: user.email,
        subject: "Welcome to OJ Furniture",
        html: baseTemplate(
          registrationTemplate(user.firstName))
      });
    } catch (emailError) {
      console.error("Email failed:", emailError.message);
    }


// Auto-Signin after registration
    const token = signToken(user.id);

     res.cookie("token", token, {
       httpOnly: true,
       sameSite: "lax"
     });

    res.status(201).json({ message: "User registered successfully" });
    
   } catch (error) {
     console.error(error);
     res.status(500).json({ message: "Server error" });
    }

};




exports.signin = async (req, res) => {
const { email, password } = req.body;
 

const user = await prisma.user.findUnique({ where: { email } });
if (!user) return res.status(401).json({ message: 'Invalid credentials' });

const valid = await bcrypt.compare(password, user.password);


if (user.accountLocked)
    return res.status(403).json({
      message: "Account locked. Please reset your password."
    });

  // const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    const attempts = user.failedLoginAttempts + 1;

    if (attempts >= 3) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: attempts,
          accountLocked: true
        }
      });

      return res.status(403).json({
        message: "Account locked. Please reset your password."
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: attempts }
    });

    return res.status(401).json({
      message: `Invalid credentials. Attempt ${attempts}/3`
    });
  }

  // Reset attempts on successful login
  await prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginAttempts: 0
    }
  });


const token = signToken(user.id);


// Store JWT in HTTP‑only cookie
 res.cookie('token', token, {
 httpOnly: true,
 sameSite: 'lax'
 });



res.json({ message: 'Signed in', token });
};


function generateResetCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user)
    return res.status(404).json({ message: "User not found" });

  const code = generateResetCode();
  const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetCode: code,
      resetCodeExpiry: expiry
    }
  });
// Send reset code email
  await sendEmail({
    to: user.email,
    subject: "Password Reset Code",
    html: baseTemplate(`
      <h2>Password Reset</h2>
      <p>Your reset code is:</p>
      <h1 style="letter-spacing:5px;">${code}</h1>
      <p>This code expires in 15 minutes.</p>
    `)
  });

  res.json({ message: "Reset code sent to email" });
};


// Reset password controller
exports.resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.resetCode !== code)
    return res.status(400).json({ message: "Invalid reset code" });

  if (user.resetCodeExpiry < new Date())
    return res.status(400).json({ message: "Reset code expired" });

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashed,
      failedLoginAttempts: 0,
      accountLocked: false,
      resetCode: null,
      resetCodeExpiry: null
    }
  });

  res.json({ message: "Password successfully reset" });
};


// Signout controller
exports.signout = (req, res) => {
res.clearCookie('token');
res.json({ message: 'Signed out' });
};