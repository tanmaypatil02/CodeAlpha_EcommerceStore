const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function initializeDatabase() {

    try {

        // =========================
        // PRODUCTS TABLE
        // =========================

        await pool.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                price REAL NOT NULL,
                description TEXT,
                category TEXT NOT NULL,
                image TEXT,
                stock INTEGER DEFAULT 0
            )
        `);


        // =========================
        // DEFAULT PRODUCTS
        // =========================

        const products = [

            [
                "Wireless Headphones",
                1999,
                "High-quality wireless headphones with immersive sound.",
                "audio",
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
                20
            ],

            [
                "Bluetooth Speaker",
                1499,
                "Portable speaker with powerful sound and deep bass.",
                "audio",
                "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
                30
            ],

            [
                "Noise Cancelling Earbuds",
                2299,
                "True wireless earbuds with active noise cancellation.",
                "audio",
                "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
                25
            ],

            [
                "Smart Watch",
                2499,
                "Smart watch with fitness tracking and notifications.",
                "wearables",
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
                15
            ],

            [
                "Fitness Band",
                1299,
                "Lightweight fitness tracker with heart-rate monitoring.",
                "wearables",
                "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=800&q=80",
                35
            ],

            [
                "Smart Ring",
                3499,
                "Modern smart ring for health and activity tracking.",
                "wearables",
                "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
                10
            ],

            [
                "Running Shoes",
                1799,
                "Comfortable and lightweight running shoes.",
                "footwear",
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
                25
            ],

            [
                "Casual Sneakers",
                2199,
                "Stylish everyday sneakers designed for comfort.",
                "footwear",
                "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
                20
            ],

            [
                "Sports Shoes",
                2699,
                "Performance footwear designed for training and sports.",
                "footwear",
                "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80",
                18
            ],

            [
                "Premium Backpack",
                1899,
                "Water-resistant backpack with laptop protection.",
                "accessories",
                "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
                22
            ],

            [
                "Travel Wallet",
                799,
                "Compact wallet with multiple card and travel compartments.",
                "accessories",
                "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
                40
            ],

            [
                "Laptop Sleeve",
                999,
                "Protective padded sleeve for laptops and tablets.",
                "accessories",
                "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80",
                30
            ],

            [
                "Mechanical Keyboard",
                2999,
                "RGB mechanical keyboard designed for gaming and productivity.",
                "electronics",
                "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
                15
            ],

            [
                "Wireless Mouse",
                899,
                "Ergonomic wireless mouse with precise tracking.",
                "electronics",
                "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80",
                35
            ],

            [
                "USB-C Hub",
                1299,
                "Multi-port USB-C hub for laptops and modern devices.",
                "electronics",
                "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=80",
                28
            ]

        ];


        // =========================
        // INSERT PRODUCTS
        // =========================

        for (const product of products) {

            await pool.query(
                `
                INSERT INTO products
                (
                    name,
                    price,
                    description,
                    category,
                    image,
                    stock
                )
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (name) DO NOTHING
                `,
                product
            );

        }

        console.log("✅ Products added to PostgreSQL!");


        // =========================
        // USERS TABLE
        // =========================

        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                phone TEXT
            )
        `);


        // =========================
        // ORDERS TABLE
        // =========================

        await pool.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                total REAL NOT NULL,
                phone TEXT,
                address TEXT,
                city TEXT,
                pincode TEXT,
                status TEXT DEFAULT 'Pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);


        // =========================
        // ADD DELIVERY COLUMNS
        // =========================

        await pool.query(`
            ALTER TABLE orders
            ADD COLUMN IF NOT EXISTS phone TEXT,
            ADD COLUMN IF NOT EXISTS address TEXT,
            ADD COLUMN IF NOT EXISTS city TEXT,
            ADD COLUMN IF NOT EXISTS pincode TEXT
        `);


        // =========================
        // ORDER ITEMS TABLE
        // =========================

        await pool.query(`
            CREATE TABLE IF NOT EXISTS order_items (
                id SERIAL PRIMARY KEY,
                order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
                product_id INTEGER REFERENCES products(id),
                quantity INTEGER NOT NULL,
                price REAL NOT NULL
            )
        `);

        console.log("✅ Order items table created successfully!");


        // =========================
        // DATABASE READY
        // =========================

        console.log(
            "✅ PostgreSQL tables created successfully!"
        );


    } catch (error) {

        console.error(
            "❌ Database initialization failed:"
        );

        console.error(error);

    }

}


// =========================
// INITIALIZE DATABASE
// =========================

initializeDatabase();


// =========================
// EXPORT DATABASE
// =========================

module.exports = pool;