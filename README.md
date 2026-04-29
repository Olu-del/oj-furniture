# OJ Furniture

A furniture shopping website with a simple frontend and a backend server.
Built with React, Node.js, Express, MySQL, and Prisma.
It lets users browse products, add items to a cart, checkout with delivery options, and send complaints.



## What this project is

- A website for shopping used furniture
- A backend server that stores products, users, and orders
- A login system for users
- A shopping cart and checkout flow
- A way to report order issues
- Admin pages for managing products, orders, and complaints


## Tech Stack
- Frontend: React, React Router, Context API
- Backend: Node.js, Express.js
- Database: MySQL + Prisma ORM
- Auth: JWT Authentication
- Email: Nodemailer (Gmail App Password)
- Other: Sustainability scoring, admin dashboards, delivery - scheduling.


## What you need to run it

- Node.js installed on your computer
- npm installed on your computer
- A MySQL database or another database supported by Prisma





## Backend setup
## To install dependencies

# Open the project folder:
# 1. Open a terminal and split into two.
2. First terminal run:
   ```
   cd backend
   ```
3. To install the backend packages, run:
   ```
   npm install
   ```


## 2. Configure environment variables
1. Rename `.env.example` with `.env`

2. Create a `.env` file with these values:

   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/ojfurniture"
   JWT_SECRET="your_jwt_secret"
   EMAIL_USER="yourgmail@gmail.com"
   EMAIL_PASS="your_app_password"
   ```
# Gmail requires an App Password if 2FA is enabled.

# 3. Run database migrations
1. To set up the database run:
   ```
   npx prisma migrate dev
   ```

# 4. Seed the database
1. To load initial data run:
   ```
   npm run seed
   ```

# 5. Start the backend
1. To start the backend server run:
   ```
   npm run dev
   ```

The backend server will run at:

```text
http://localhost:5000
```



## Frontend setup

1. Second terminal.
2. Run:
   ```
   cd frontend
   ```
3. Install the frontend packages:
   ```
   npm install
   ```
4. Start the frontend website:
   ```
   npm start
   ```

The frontend website will run at:

```
http://localhost:3000
```

> The backend must be running before the frontend works.



## How to test the project

### Register and login

- Create a new account.
- Sign in using your email and password.
- If you forget your password, request a reset code and enter it with a new password.

### Browse products

- Open the product list.
- Click a product to see more details.
- Add products to the cart.

### Use the cart and checkout

- Add products to the cart.
- Change quantity or remove items.
- Choose a delivery date and time slot.
- Place the order.

### View orders

- Open the orders page to see past orders.
- Each order shows items, prices, delivery slot, and status.

### Send a complaint

- Report an issue for an order.
- The admin can review and update the complaint.



## Quick use guide

- To start the backend:
  ```
  cd backend
  npm install
  npm run dev
  ```
- To start the frontend:
  ```
  cd frontend
  npm install
  npm start
  ```
- Open this page in your browser:
  ```
  http://localhost:3000
  ```
- Then:
  1. Register or sign in
  2. Browse products
  3. Add items to the cart
  4. Complete checkout


## Admin features

Admins can use pages to:

- Add, edit, and delete products
- View and update orders
- View and update complaints
- See simple sustainability stats



## Email features

If email settings are configured, the app can send:

- Welcome emails
- Password reset emails
- Order confirmation emails
- Contact form emails



## Helpful command

To open the database interface, use:

```
npx prisma studio
```

This helps you inspect data like users, products, orders, complaints, and address records.



## Notes

- Keep the backend running while the frontend is open.
- Use a correct database URL in `.env`.
- If you use Gmail, set up an app password if Two-Factor Authentication is on.



