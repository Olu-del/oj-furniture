// Auth controller - handles register, login, password reset, etc.
const bcrypt = require('bcryptjs'); // used for hashing passwords
const { PrismaClient } = require('@prisma/client'); // ORM for database
const { signToken } = require('../utils/jwt'); // helper to create JWT tokens


// initialise Prisma client so we can run DB queries
const prisma = new PrismaClient();


// email helpers for sending welcome/reset emails
const { sendEmail } = require("../utils/email");
const {
  baseTemplate,
  registrationTemplate
} = require("../utils/email.template");



//  REGISTER USER 
exports.register = async (req, res) => {
  try {

    // get form values from request body
    const { firstName, lastName, email, password, line1, city, postcode, country } = req.body;

    // basic validation to make sure required fields exist
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check address fields as well (used for shipping)
    if (!line1 || !city || !postcode || !country) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    // quick email format check
    if (!email.includes("@")) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // simple password rule
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // check if email is already in the database
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email is already registered. Please sign in instead." });
    }


    // hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // create the user and also store their address
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        address: {
          create: [{ line1, city, postcode, country }] // nested create
        }
      }
    });


    // try sending a welcome email after registration
    try {
      await sendEmail({
        to: user.email,
        subject: "Welcome to OJ Furniture",
        html: baseTemplate(
          registrationTemplate(user.firstName)) // personalised email
      });
    } catch (emailError) {
      // if email fails, just log it but don't stop registration
      console.error("Email failed:", emailError.message);
    }


    // automatically sign user in after registration
    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role
    });

    // store token in a HTTP-only cookie for security
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax"
    });

    // send user info back to frontend
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    });

  } catch (error) {
    // catch any unexpected errors
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }

};



//  Sign In 
exports.signin = async (req, res) => {

  const { email, password } = req.body;

  // find user by email
  const user = await prisma.user.findUnique({ where: { email } });

  // if user doesn't exist
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });


  // if account was locked due to too many failed attempts
  if (user.accountLocked)
    return res.status(403).json({
      message: "You entered an incorrect password 3 times. Your account is now locked. Please reset your password to continue."
    });

  // compare entered password with stored hashed password
  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {

    // increase failed login attempts
    const attempts = user.failedLoginAttempts + 1;

    // lock account after 3 failed attempts
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

    // update failed attempts count
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: attempts }
    });

    return res.status(401).json({
      message: `Invalid credentials. Attempt ${attempts}/3`
    });
  }

  // if login succeeds, reset failed attempts
  await prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginAttempts: 0
    }
  });


  // create JWT token with user id + role
  const token = signToken({
    id: user.id,
    role: user.role
  });


  // store token in cookie
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax'
  });

  // send user info back
  res.json({
    id: user.id,
    email: user.email,
    role: user.role,
    token: token
  });

};



// helper function to generate a 6-digit reset code
function generateResetCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}



//  Request password reset - generates a reset code and emails it to the user 
exports.requestPasswordReset = async (req, res) => {

  const { email } = req.body;

  // find user by email
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user)
    return res.status(404).json({ message: "User not found" });

  // generate reset code
  const code = generateResetCode();

  // code expires in 15 minutes
  const expiry = new Date(Date.now() + 15 * 60 * 1000);

  // save reset code + expiry in database
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetCode: code,
      resetCodeExpiry: expiry
    }
  });


  // send reset code to user's email
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



//  RESET PASSWORD 
exports.resetPassword = async (req, res) => {

  const { email, code, newPassword } = req.body;

  // get user by email
  const user = await prisma.user.findUnique({ where: { email } });

  // check if code matches
  if (!user || user.resetCode !== code)
    return res.status(400).json({ message: "Invalid reset code" });

  // check if code expired
  if (user.resetCodeExpiry < new Date())
    return res.status(400).json({ message: "Reset code expired" });

  // hash new password
  const hashed = await bcrypt.hash(newPassword, 10);

  // update password and reset account lock data
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



//  Sign out - clears the JWT cookie 
exports.signout = (req, res) => {

  // remove JWT cookie
  res.clearCookie('token');

  res.json({ message: 'Signed out' });

};