# 🛍️ CodeAlpha E-Commerce Store
A full-stack e-commerce web application developed as part of the CodeAlpha Internship Program.

## 🚀 Features

- 🛒 Product listing
- 🔍 Product search
- 🏷️ Category filtering
- 💰 Price sorting
- 📦 Product details
- 🛍️ Add to cart
- ➕➖ Cart quantity management
- ❌ Remove products from cart
- 🔐 User registration and login
- 👤 User account management
- 🚚 Checkout with delivery details
- 📋 Order processing
- 🗄️ SQLite database
- 🔔 Interactive notifications
- 📱 Responsive design

## 🛠️ Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Express.js

### Database

- SQLite
- Better-SQLite3

## 📂 Project Structure

```text
CodeAlpha_EcommerceStore/
│
├── backend/
│   ├── server.js
│   └── database.js
│
├── frontend/
│   ├── index.html
│   ├── product.html
│   ├── cart.html
│   ├── checkout.html
│   ├── auth.html
│   ├── script.js
│   └── style.css
│
├── .gitignore
├── package.json
└── package-lock.json
```

## ▶️ How to Run

### 1. Clone the repository

```bash
git clone https://github.com/tanmaypatil02/CodeAlpha_EcommerceStore.git
```

### 2. Open the project folder

```bash
cd CodeAlpha_EcommerceStore
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the server

```bash
node backend/server.js
```

### 5. Open the application

Open the following URL in your browser:

```text
http://localhost:5000
```

## 🛒 Application Flow

```text
Home
  ↓
Browse Products
  ↓
Search / Filter / Sort
  ↓
View Product Details
  ↓
Add to Cart
  ↓
Shopping Cart
  ↓
Login / Register
  ↓
Checkout
  ↓
Place Order
  ↓
Order Saved in Database
```

## 🔐 Database

The application uses SQLite to store:

- Users
- Products
- Orders

The database file is excluded from GitHub using `.gitignore` to protect user data.

## 📌 Internship Project

This project was developed as part of the **CodeAlpha Internship Program**.

## 👨‍💻 Author

**Tanmay Patil**

Made with ❤️ by Tanmay ⚡
