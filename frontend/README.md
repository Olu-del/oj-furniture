# Getting Started with OJ E-commerce Web app

# project root
 backend
 frontend

# Backend Setup

# Step 1: Navigate to Backend

# In the project directory run:
cd backend


# Step 2: Install Dependencies

# In the project directory run:
npm install


# Backend Dependencies Used
express prisma @prisma/client bcryptjs jsonwebtoken cors helmet cookie-parser dotenv


# Step 3: Setup Environment Variables
Create a .env file inside the backend folder:

PORT=5000
DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/oj_furniture"
JWT_SECRET=your_super_secret_key


# Replace:
USERNAME, PASSWORD and oj_furniture with your MySQL database

# Step 4: Setup Database

# Run:
npx prisma migrate dev --name init


# Step 5: Start Backend Server
npm run dev

# This make page reload when you make changes.
You may also see any lint errors in the console.


# or

node server.js

# Server runs on:
http://localhost:5000


# Frontend Setup
# Step 1: To navigate to Frontend Folder
cd frontend

# Step 2: Install Dependencies
npm install

# Frontend Dependencies Used

react react-router-dom axios

# Step 3: Start Frontend
npm start

# Frontend runs on:
http://localhost:3000


# Authentication uses:

JWT tokens

Stored in HTTP-only cookies

Verified using middleware

Global AuthContext for frontend state


# How to Register

Open:

http://localhost:3000/register

# Enter:

First Name

Last Name

Email

Password (minimum 6 characters)

# Click Register




# How to Login

Go to:

http://localhost:3000/login


Enter:

Registered Email

Password

# Click Login

After successful login:

JWT cookie is set

Navbar shows:

Home  Hello, FirstName  Logout


# How to Logout

# Click Logout in Navbar

Cookie is cleared

Auth state resets

Navbar updates to:

Home  Register  Login

# Authentication Behavior

# State	           Navbar Display
Not Logged In	   Home • Register • Login
Logged In	       Home • Hello, FirstName • Logout


# Security Features

Password hashing with bcrypt

JWT signed with secret key

HTTP-only cookies

CORS configured for credentials

Helmet for secure headers

# Development Notes

# If you change Prisma schema:

npx prisma migrate dev


# If you reset database:

npx prisma migrate reset

# Project Status

Registration
Login
Logout
Authenticated Navbar
JWT Authentication
Protected user endpoint