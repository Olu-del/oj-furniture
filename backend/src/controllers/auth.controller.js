const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { signToken } = require('../utils/jwt');


const prisma = new PrismaClient();


exports.register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashed
      }
    });

    res.json({ message: "User registered", user });
  } catch (err) {
    res.status(400).json({ message: "Email already exists" });
  }
};



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
sameSite: 'strict'
});


res.json({ message: 'Signed in', token });
};


exports.signout = (req, res) => {
res.clearCookie('token');
res.json({ message: 'Signed out' });
};