# Project Setup
Before running the project, make sure you have the following installed:
Node.js
The project requires Node.js (version 16 or later).
Download from: https://nodejs.org
Installing Node.js automatically installs npm (Node Package Manager).


# Installation & Setup
Follow these steps to run the project locally.

# 1. Install Backend Dependencies
1. Open your terminal.
2. Navigate to the folder where you want to store the project.
3. Run the following command:
cd backend
npm install

# 2.Configure Environment Variables
Inside the backend folder: Rename .env.example file to .env
DATABASE_URL="mysql://user:password@localhost:3306/ojfurniture"
JWT_SECRET="your_jwt_secret"
EMAIL_USER="yourgmail@gmail.com"
EMAIL_PASS="your_app_password"
Note: Gmail requires an App Password if 2FA is enabled.

# 3. Set Up the Database
Run Prisma migrations:
npx prisma migrate dev
Seed the database:
npm run seed

# 4. Start the Backend Server
npm run dev
Backend runs on:
http://localhost:5000

# 5. Install Frontend Dependencies
Navigate to the frontend folder
cd frontend
npm install
This installs all required React packages:

# 6. Start the Frontend
npm start
This will:
•	Start React on http://localhost:3000
•	Automatically open the browser
•	Hot reload changes instantly


## Note: Backend Must Be Running Too
Your React app communicates with the backend API.
cd backend
npm install
npm run dev
And ensure the .env file is created.

Project Purpose
This project was built to explore:
Sustainable UX design
Trust and transparency in e‑commerce
Secure authentication workflows
Delivery logistics
Accountability through complaints/returns
Environmental impact awareness
It demonstrates full‑stack engineering skills, user‑centred design, and real‑world e‑commerce patterns.



# Testing the Project
This section explains how to manually test all major features of the OJ Furniture website.
The project does not require automated tests; instead, you can verify functionality through the UI and API.

# 1. Authentication & User Accounts
Register a new user
•	Go to register
•	Fill in the form
•	Submit
You should receive a welcome email (if email is configured)

# Sign in
•	Go to sign in
•	Enter valid credentials
You should be redirected to the homepage

# Invalid sign in
•	Enter wrong password
You should see an error message

# +Password reset
•	Go to forgot password
•	Enter your email
You should receive a reset code
•	Enter the code + new password
You should be able to sign in with the new password

# 2. Products & Browsing
View product list
•	Click product
Products should load with images, price, and description

# View product details
•	Click a product image
You should see full details, the sustainability score, and the image

# Admin product management
•	Sign in as admin
•	Visit /admin/products 
You should see the product grid

# Add a product
•	Go to /admin/products/new
•	Fill in details + upload image
The product should appear in the list

# Edit a product
•	Click “Edit” on any product
Changes should save

# Delete a product
•	Click “Delete”
The product should be removed

# 3. Cart & Checkout
Add to cart
•	Open a product
•	Click “Add to Cart”
Cart count should update

# View cart
•	Go to basket 
Items should appear with quantity controls

# Update quantity
•	Increase/decrease quantity
Totals should update

# Remove item
•	Click “Remove”
The item should disappear

# Checkout
•	Go to checkout
•	Select delivery date + slot
The order should be created
Cart should clear
You should receive an order confirmation email

# 4. Orders & Delivery Tracking
View order history
•	Sign in
•	Go to orders 
All past orders should appear

# Order details
•	Each order should show: 
o	Items
o	Prices
o	Delivery slot
o	Delivery status

# Admin updates delivery status
•	Go to /admin/orders
•	Change status (PENDING → SHIPPED → DELIVERED)
User should see updated status in /orders

# 5. Complaints & Returns
Submit a complaint
•	Sign in
•	Go to orders
•	Click Report an Issue / Request Return
•	Fill in the form
The complaint should be saved
The should see a success message

# Admin complaint management
•	Go to /admin/complaints
•	Filter by status
Complaints should appear
Update complaint status
•	Change status (OPEN → IN_REVIEW → RESOLVED → REJECTED)
User should see the updated status in their account (if implemented)

# 6. Sustainability Analytics (Admin)
View sustainability dashboard
•	Go to /admin/sustainability 
You should see: 
o	Total CO₂ saved
o	Total waste saved
o	Average sustainability score

# 7. Email Notifications
If email is configured for Gmail test:
Welcome email
Sent for registration
Password reset email
Sent when requesting reset code
Order confirmation email
Sent after checkout
Contact form email
Sent when the user submits the contact form

# 8. Security Checks
Protected routes
Try accessing admin pages as a normal user:
You should be blocked
Try to checkout without signing in:
You should be redirected to sign in

# 9. Database Checks (Optional)
Using Prisma Studio:
npx prisma studio
Verify:
•	Users table
•	Products table
•	Orders + OrderItems
•	Complaints
•	Categories
•	Addresses
Data should match your actions in the UI


