const express = require("express");
const path = require("path");
const db = require("./database-pg");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 5000;


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(express.json());

app.use(
    session({
        secret: "codealpha-admin-secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false
        }
    })
);

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

app.get("/api/products", async (req, res) => {

    try {

        const result = await db.query(
            "SELECT * FROM products ORDER BY id"
        );

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to load products"
        });

    }

});


// ======================================================
// REGISTER API
// ======================================================

app.post("/api/register", async (req, res) => {

    const {
        name,
        email,
        password,
        phone
    } = req.body;

    if (!name || !email || !password) {

        return res.status(400).json({
            message: "All fields are required"
        });

    }

    try {

        const result = await db.query(
            `
            INSERT INTO users
            (
                name,
                email,
                password,
                phone
            )
            VALUES ($1, $2, $3, $4)
            RETURNING id
            `,
            [
                name,
                email,
                password,
                phone || null
            ]
        );

        res.json({
            message: "Registration successful!",
            userId: result.rows[0].id
        });

    } catch (error) {

        console.error(error);

        res.status(400).json({
            message: "Email already registered"
        });

    }

});


// ======================================================
// LOGIN API
// ======================================================

app.post("/api/login", async (req, res) => {

    const {
        email,
        password
    } = req.body;

    try {

        const result = await db.query(
            `
            SELECT
                id,
                name,
                email,
                phone
            FROM users
            WHERE email = $1
            AND password = $2
            `,
            [
                email,
                password
            ]
        );

        const user = result.rows[0];

        if (!user) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }

        res.json({
            message: "Login successful!",
            user: user
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to login"
        });

    }

});


// ======================================================
// CREATE ORDER API
// ======================================================

app.post("/api/orders", async (req, res) => {

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
            message: "Please provide all order details"
        });

    }


    try {

        // =========================
        // CHECK USER
        // =========================

        const userResult = await db.query(
            `
            SELECT id
            FROM users
            WHERE id = $1
            `,
            [userId]
        );

        const user = userResult.rows[0];


        if (!user) {

            return res.status(401).json({
                message: "User not found. Please login again."
            });

        }


        // =========================
        // CREATE ORDER
        // =========================

        const orderResult = await db.query(
            `
            INSERT INTO orders
            (
                user_id,
                total,
                phone,
                address,
                city,
                pincode,
                status
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
            `,
            [
                userId,
                total,
                phone,
                address,
                city,
                pincode,
                "Pending"
            ]
        );


        const orderId = orderResult.rows[0].id;


        // =========================
        // SAVE ORDER ITEMS
        // =========================

        for (const item of items) {

            await db.query(
                `
                INSERT INTO order_items
                (
                    order_id,
                    product_id,
                    quantity,
                    price
                )
                VALUES ($1, $2, $3, $4)
                `,
                [
                    orderId,
                    item.id,
                    item.quantity,
                    item.price
                ]
            );

        }


        // =========================
        // SUCCESS RESPONSE
        // =========================

        res.json({
            message: "Order placed successfully!",
            orderId: orderId
        });


    } catch (error) {

        console.error(
            "Order error:",
            error
        );

        res.status(500).json({
            message: "Unable to place order"
        });

    }

});


// ======================================================
// ADMIN LOGIN
// ======================================================

app.post("/api/admin/login", (req, res) => {

    const {
        email,
        password
    } = req.body;


    if (
        email === "admin@codealpha.com" &&
        password === "Admin@123"
    ) {

        req.session.isAdmin = true;

        return res.json({
            message: "Admin login successful"
        });

    }


    res.status(401).json({
        message: "Invalid admin credentials"
    });

});


// ======================================================
// ADMIN AUTH MIDDLEWARE
// ======================================================

function requireAdmin(req, res, next) {

    if (req.session.isAdmin) {

        return next();

    }


    res.status(403).json({
        message: "Admin access required"
    });

}


// ======================================================
// ADMIN SESSION CHECK
// ======================================================

app.get("/api/admin/check", (req, res) => {

    if (req.session.isAdmin) {

        return res.json({
            isAdmin: true
        });

    }


    res.status(403).json({
        isAdmin: false
    });

});


// ======================================================
// ADMIN USERS API
// ======================================================

app.get(
    "/api/admin/users",
    requireAdmin,
    async (req, res) => {

        try {

            const result = await db.query(
                `
                SELECT
                    id,
                    name,
                    email,
                    phone
                FROM users
                ORDER BY id DESC
                `
            );

            res.json(result.rows);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Unable to load users"
            });

        }

    }
);


// ======================================================
// ADMIN ORDERS API
// ======================================================

app.get(
    "/api/admin/orders",
    requireAdmin,
    async (req, res) => {

        try {

            const result = await db.query(
                `
                SELECT
                    orders.id,
                    users.name,
                    users.email,
                    orders.total,
                    orders.status,
                    orders.created_at
                FROM orders
                LEFT JOIN users
                ON orders.user_id = users.id
                ORDER BY orders.id DESC
                `
            );

            res.json(result.rows);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Unable to load orders"
            });

        }

    }
);


// ======================================================
// START SERVER
// ======================================================

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `Server running at http://localhost:${PORT}`
        );

    }
);