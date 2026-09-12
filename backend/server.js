const express = require("express");
const path = require("path");
const db = require("./database");

const app = express();

const PORT = 5000;


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(express.json());


// Serve frontend files

app.use(
    express.static(
        path.join(__dirname, "../frontend"),
        {
            index: false
        }
    )
);


// ======================================================
// HOME PAGE
// ======================================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../frontend/auth.html"
        )
    );

});


// ======================================================
// PRODUCTS API
// ======================================================

app.get("/api/products", (req, res) => {

    try {

        const products =
            db
                .prepare(
                    "SELECT * FROM products"
                )
                .all();


        res.json(products);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message:
                "Unable to load products"
        });

    }

});


// ======================================================
// REGISTER API
// ======================================================

app.post("/api/register", (req, res) => {

    const {
        name,
        email,
        password,
        phone
    } = req.body;


    if (
        !name ||
        !email ||
        !password
    ) {

        return res.status(400).json({

            message:
                "All fields are required"

        });

    }


    try {

        const user =
            db
                .prepare(`
                    INSERT INTO users
                    (
                        name,
                        email,
                        password,
                        phone
                    )
                    VALUES (?, ?, ?, ?)
                `)
                .run(
                    name,
                    email,
                    password,
                    phone || null
                );


        res.json({

            message:
                "Registration successful!",

            userId:
                user.lastInsertRowid

        });

    } catch (error) {

        console.error(error);


        res.status(400).json({

            message:
                "Email already registered"

        });

    }

});


// ======================================================
// LOGIN API
// ======================================================

app.post("/api/login", (req, res) => {

    const {
        email,
        password
    } = req.body;


    const user =
        db
            .prepare(`
                SELECT
                    id,
                    name,
                    email,
                    phone
                FROM users
                WHERE email = ?
                AND password = ?
            `)
            .get(
                email,
                password
            );


    if (!user) {

        return res.status(401).json({

            message:
                "Invalid email or password"

        });

    }


    res.json({

        message:
            "Login successful!",

        user:
            user

    });

});


// ======================================================
// CREATE ORDER API
// ======================================================

app.post("/api/orders", (req, res) => {

    const {
        userId,
        total,
        phone,
        address,
        city,
        pincode,
        items
    } = req.body;


    // Check required information

    if (
        !userId ||
        !total ||
        !phone ||
        !address ||
        !city ||
        !pincode ||
        !items ||
        items.length === 0
    ) {

        return res.status(400).json({

            message:
                "Please provide all order details"

        });

    }


    try {

        // Make sure user exists

        const user =
            db
                .prepare(`
                    SELECT id
                    FROM users
                    WHERE id = ?
                `)
                .get(userId);


        if (!user) {

            return res.status(401).json({

                message:
                    "User not found. Please login again."

            });

        }


        // Save order

        const order =
            db
                .prepare(`
                    INSERT INTO orders
                    (
                        user_id,
                        total,
                        status
                    )
                    VALUES (?, ?, ?)
                `)
                .run(
                    userId,
                    total,
                    "Pending"
                );


        res.json({

            message:
                "Order placed successfully!",

            orderId:
                order.lastInsertRowid

        });


    } catch (error) {

        console.error(
            "Order error:",
            error
        );


        res.status(500).json({

            message:
                "Unable to place order"

        });

    }

});


// ======================================================
// START SERVER
// ======================================================

app.listen(
    PORT,
    () => {

        console.log(
            `Server running at http://localhost:${PORT}`
        );

    }
);