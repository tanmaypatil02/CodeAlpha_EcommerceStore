# 🛍️ CodeAlpha E-Commerce Store

A full-stack e-commerce web application developed as part of my **CodeAlpha Internship Program**.

The project allows users to browse products, view product details, manage their shopping cart, create an account, place orders, choose payment methods, and submit product reviews.

It also includes an **Admin Dashboard** for viewing registered users and customer orders.

---

## 🚀 Live Demo

🌐 **Live Website:**  
https://codealpha-ecommercestore-dn7m.onrender.com

📂 **GitHub Repository:**  
https://github.com/tanmaypatil02/CodeAlpha_EcommerceStore

---

## ✨ Features

### 👤 User Authentication
- User registration
- User login
- Email and password authentication
- User information stored in PostgreSQL database

### 🛍️ Products
- Product listing
- Product details page
- Product images
- Product prices
- Stock availability
- Product descriptions
- Add products to cart
- Buy Now functionality

### 🔎 Product Browsing
- Search products
- Category filtering
- Product sorting
- Responsive product cards

### 🛒 Shopping Cart
- Add products to cart
- Increase/decrease quantity
- Remove products
- Automatic total calculation
- Cart persistence using browser storage

### 📦 Checkout & Orders
- Customer phone number
- Delivery address
- City
- Pincode
- Order summary
- Payment method selection
- Cash on Delivery
- UPI payment option
- Card payment option
- Order confirmation
- Order ID generation

> Note: UPI and Card payments are implemented as a payment-flow simulation and do not process real transactions.

### ⭐ Product Reviews
- 1–5 star ratings
- Written product reviews
- Average product rating
- Review count
- Reviewer name
- Review date
- Reviews stored in PostgreSQL

### 🔐 Admin Dashboard
- Separate admin login
- Admin authentication
- View total users
- View total orders
- View total sales
- View registered users
- View customer orders
- View payment methods
- View order status

### 📱 Responsive Design
The website is designed to work across:

- 💻 Desktop
- 📱 Mobile
- 📟 Tablet

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL

### Authentication & Sessions
- Express Session

### Deployment
- Render

### Version Control
- Git
- GitHub

---

## 📁 Project Structure

```text
CodeAlpha_EcommerceStore/
│
├── backend/
│   ├── server.js
│   ├── database.js
│   └── database-pg.js
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── cart.html
│   ├── product.html
│   ├── auth.html
│   ├── checkout.html
│   ├── admin.html
│   └── admin-login.html
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
