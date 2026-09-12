const Database = require("better-sqlite3");

const db = new Database("ecommerce.db");


// =========================
// PRODUCTS TABLE
// =========================

db.prepare(`
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        image TEXT,
        stock INTEGER DEFAULT 0
    )
`).run();


// =========================
// ADD CATEGORY COLUMN
// FOR OLD DATABASE
// =========================

try {

    db.prepare(`
        ALTER TABLE products
        ADD COLUMN category TEXT DEFAULT 'general'
    `).run();

    console.log("✅ Category column added!");

} catch (error) {

    if (!error.message.includes("duplicate column name")) {
        throw error;
    }

}


// =========================
// ADD IMAGE COLUMN
// FOR OLD DATABASE
// =========================

try {

    db.prepare(`
        ALTER TABLE products
        ADD COLUMN image TEXT
    `).run();

    console.log("✅ Image column added!");

} catch (error) {

    if (!error.message.includes("duplicate column name")) {
        throw error;
    }

}


// =========================
// UPDATE OLD PRODUCT CATEGORIES
// =========================

db.prepare(`
    UPDATE products
    SET category = CASE

        WHEN name = 'Wireless Headphones'
            THEN 'audio'

        WHEN name = 'Smart Watch'
            THEN 'wearables'

        WHEN name = 'Running Shoes'
            THEN 'footwear'

        ELSE category

    END
`).run();


// =========================
// DEFAULT PRODUCTS
// =========================

const products = [

    {
        name: "Wireless Headphones",
        price: 1999,
        description:
            "High-quality wireless headphones with immersive sound.",
        category: "audio",
        image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
        stock: 20
    },

    {
        name: "Bluetooth Speaker",
        price: 1499,
        description:
            "Portable speaker with powerful sound and deep bass.",
        category: "audio",
        image:
            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
        stock: 30
    },

    {
        name: "Noise Cancelling Earbuds",
        price: 2299,
        description:
            "True wireless earbuds with active noise cancellation.",
        category: "audio",
        image:
            "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
        stock: 25
    },

    {
        name: "Smart Watch",
        price: 2499,
        description:
            "Smart watch with fitness tracking and notifications.",
        category: "wearables",
        image:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
        stock: 15
    },

    {
        name: "Fitness Band",
        price: 1299,
        description:
            "Lightweight fitness tracker with heart-rate monitoring.",
        category: "wearables",
        image:
            "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=800&q=80",
        stock: 35
    },

    {
        name: "Smart Ring",
        price: 3499,
        description:
            "Modern smart ring for health and activity tracking.",
        category: "wearables",
        image:
            "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
        stock: 10
    },

    {
        name: "Running Shoes",
        price: 1799,
        description:
            "Comfortable and lightweight running shoes.",
        category: "footwear",
        image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        stock: 25
    },

    {
        name: "Casual Sneakers",
        price: 2199,
        description:
            "Stylish everyday sneakers designed for comfort.",
        category: "footwear",
        image:
            "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
        stock: 20
    },

    {
        name: "Sports Shoes",
        price: 2699,
        description:
            "Performance footwear designed for training and sports.",
        category: "footwear",
        image:
            "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80",
        stock: 18
    },

    {
        name: "Premium Backpack",
        price: 1899,
        description:
            "Water-resistant backpack with laptop protection.",
        category: "accessories",
        image:
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
        stock: 22
    },

    {
        name: "Travel Wallet",
        price: 799,
        description:
            "Compact wallet with multiple card and travel compartments.",
        category: "accessories",
        image:
            "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
        stock: 40
    },

    {
        name: "Laptop Sleeve",
        price: 999,
        description:
            "Protective padded sleeve for laptops and tablets.",
        category: "accessories",
        image:
            "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80",
        stock: 30
    },

    {
        name: "Mechanical Keyboard",
        price: 2999,
        description:
            "RGB mechanical keyboard designed for gaming and productivity.",
        category: "electronics",
        image:
            "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
        stock: 15
    },

    {
        name: "Wireless Mouse",
        price: 899,
        description:
            "Ergonomic wireless mouse with precise tracking.",
        category: "electronics",
        image:
            "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80",
        stock: 35
    },

    {
        name: "USB-C Hub",
        price: 1299,
        description:
            "Multi-port USB-C hub for laptops and modern devices.",
        category: "electronics",
        image:
            "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=80",
        stock: 28
    }

];


// =========================
// INSERT PRODUCTS
// =========================

const insertProduct = db.prepare(`
    INSERT INTO products
    (
        name,
        price,
        description,
        category,
        image,
        stock
    )

    SELECT
        @name,
        @price,
        @description,
        @category,
        @image,
        @stock

    WHERE NOT EXISTS (
        SELECT 1
        FROM products
        WHERE name = @name
    )
`);


for (const product of products) {

    insertProduct.run(product);

}


// =========================
// UPDATE PRODUCT IMAGES
// =========================

for (const product of products) {

    db.prepare(`
        UPDATE products

        SET image = @image

        WHERE name = @name
    `).run({

        name: product.name,

        image: product.image

    });

}


// =========================
// USERS TABLE
// =========================

db.prepare(`
    CREATE TABLE IF NOT EXISTS users (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        name TEXT NOT NULL,

        email TEXT UNIQUE NOT NULL,

        password TEXT NOT NULL,

        phone TEXT

    )
`).run();


// =========================
// ADD PHONE COLUMN
// FOR EXISTING USERS TABLE
// =========================

try {

    db.prepare(`
        ALTER TABLE users
        ADD COLUMN phone TEXT
    `).run();

    console.log("✅ Phone column added!");

} catch (error) {

    if (!error.message.includes("duplicate column name")) {
        throw error;
    }

}


// =========================
// ORDERS TABLE
// =========================

db.prepare(`
    CREATE TABLE IF NOT EXISTS orders (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        user_id INTEGER,

        total REAL NOT NULL,

        status TEXT DEFAULT 'Pending',

        created_at
            DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (user_id)
            REFERENCES users(id)

    )
`).run();


// =========================
// DATABASE READY
// =========================

console.log("✅ Database connected successfully!");


module.exports = db;